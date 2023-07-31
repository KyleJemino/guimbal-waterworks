defmodule GuimbalWaterworksWeb.UsersAuthTest do
  use GuimbalWaterworksWeb.ConnCase, async: true

  alias GuimbalWaterworks.Accounts
  alias GuimbalWaterworksWeb.UsersAuth
  import GuimbalWaterworks.AccountsFixtures

  @remember_me_cookie "_guimbal_waterworks_web_users_remember_me"

  setup %{conn: conn} do
    conn =
      conn
      |> Map.replace!(:secret_key_base, GuimbalWaterworksWeb.Endpoint.config(:secret_key_base))
      |> init_test_session(%{})

    %{users: users_fixture(), conn: conn}
  end

  describe "log_in_users/3" do
    test "stores the users token in the session", %{conn: conn, users: users} do
      conn = UsersAuth.log_in_users(conn, users)
      assert token = get_session(conn, :users_token)
      assert get_session(conn, :live_socket_id) == "users_sessions:#{Base.url_encode64(token)}"
      assert redirected_to(conn) == "/"
      assert Accounts.get_users_by_session_token(token)
    end

    test "clears everything previously stored in the session", %{conn: conn, users: users} do
      conn = conn |> put_session(:to_be_removed, "value") |> UsersAuth.log_in_users(users)
      refute get_session(conn, :to_be_removed)
    end

    test "redirects to the configured path", %{conn: conn, users: users} do
      conn = conn |> put_session(:users_return_to, "/hello") |> UsersAuth.log_in_users(users)
      assert redirected_to(conn) == "/hello"
    end

    test "writes a cookie if remember_me is configured", %{conn: conn, users: users} do
      conn = conn |> fetch_cookies() |> UsersAuth.log_in_users(users, %{"remember_me" => "true"})
      assert get_session(conn, :users_token) == conn.cookies[@remember_me_cookie]

      assert %{value: signed_token, max_age: max_age} = conn.resp_cookies[@remember_me_cookie]
      assert signed_token != get_session(conn, :users_token)
      assert max_age == 5_184_000
    end
  end

  describe "logout_users/1" do
    test "erases session and cookies", %{conn: conn, users: users} do
      users_token = Accounts.generate_users_session_token(users)

      conn =
        conn
        |> put_session(:users_token, users_token)
        |> put_req_cookie(@remember_me_cookie, users_token)
        |> fetch_cookies()
        |> UsersAuth.log_out_users()

      refute get_session(conn, :users_token)
      refute conn.cookies[@remember_me_cookie]
      assert %{max_age: 0} = conn.resp_cookies[@remember_me_cookie]
      assert redirected_to(conn) == "/"
      refute Accounts.get_users_by_session_token(users_token)
    end

    test "broadcasts to the given live_socket_id", %{conn: conn} do
      live_socket_id = "users_sessions:abcdef-token"
      GuimbalWaterworksWeb.Endpoint.subscribe(live_socket_id)

      conn
      |> put_session(:live_socket_id, live_socket_id)
      |> UsersAuth.log_out_users()

      assert_receive %Phoenix.Socket.Broadcast{event: "disconnect", topic: ^live_socket_id}
    end

    test "works even if users is already logged out", %{conn: conn} do
      conn = conn |> fetch_cookies() |> UsersAuth.log_out_users()
      refute get_session(conn, :users_token)
      assert %{max_age: 0} = conn.resp_cookies[@remember_me_cookie]
      assert redirected_to(conn) == "/"
    end
  end

  describe "fetch_current_users/2" do
    test "authenticates users from session", %{conn: conn, users: users} do
      users_token = Accounts.generate_users_session_token(users)
      conn = conn |> put_session(:users_token, users_token) |> UsersAuth.fetch_current_users([])
      assert conn.assigns.current_users.id == users.id
    end

    test "authenticates users from cookies", %{conn: conn, users: users} do
      logged_in_conn =
        conn |> fetch_cookies() |> UsersAuth.log_in_users(users, %{"remember_me" => "true"})

      users_token = logged_in_conn.cookies[@remember_me_cookie]
      %{value: signed_token} = logged_in_conn.resp_cookies[@remember_me_cookie]

      conn =
        conn
        |> put_req_cookie(@remember_me_cookie, signed_token)
        |> UsersAuth.fetch_current_users([])

      assert get_session(conn, :users_token) == users_token
      assert conn.assigns.current_users.id == users.id
    end

    test "does not authenticate if data is missing", %{conn: conn, users: users} do
      _ = Accounts.generate_users_session_token(users)
      conn = UsersAuth.fetch_current_users(conn, [])
      refute get_session(conn, :users_token)
      refute conn.assigns.current_users
    end
  end

  describe "redirect_if_users_is_authenticated/2" do
    test "redirects if users is authenticated", %{conn: conn, users: users} do
      conn = conn |> assign(:current_users, users) |> UsersAuth.redirect_if_users_is_authenticated([])
      assert conn.halted
      assert redirected_to(conn) == "/"
    end

    test "does not redirect if users is not authenticated", %{conn: conn} do
      conn = UsersAuth.redirect_if_users_is_authenticated(conn, [])
      refute conn.halted
      refute conn.status
    end
  end

  describe "require_authenticated_users/2" do
    test "redirects if users is not authenticated", %{conn: conn} do
      conn = conn |> fetch_flash() |> UsersAuth.require_authenticated_users([])
      assert conn.halted
      assert redirected_to(conn) == Routes.users_session_path(conn, :new)
      assert get_flash(conn, :error) == "You must log in to access this page."
    end

    test "stores the path to redirect to on GET", %{conn: conn} do
      halted_conn =
        %{conn | path_info: ["foo"], query_string: ""}
        |> fetch_flash()
        |> UsersAuth.require_authenticated_users([])

      assert halted_conn.halted
      assert get_session(halted_conn, :users_return_to) == "/foo"

      halted_conn =
        %{conn | path_info: ["foo"], query_string: "bar=baz"}
        |> fetch_flash()
        |> UsersAuth.require_authenticated_users([])

      assert halted_conn.halted
      assert get_session(halted_conn, :users_return_to) == "/foo?bar=baz"

      halted_conn =
        %{conn | path_info: ["foo"], query_string: "bar", method: "POST"}
        |> fetch_flash()
        |> UsersAuth.require_authenticated_users([])

      assert halted_conn.halted
      refute get_session(halted_conn, :users_return_to)
    end

    test "does not redirect if users is authenticated", %{conn: conn, users: users} do
      conn = conn |> assign(:current_users, users) |> UsersAuth.require_authenticated_users([])
      refute conn.halted
      refute conn.status
    end
  end
end
