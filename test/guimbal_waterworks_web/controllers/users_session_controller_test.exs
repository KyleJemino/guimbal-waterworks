defmodule GuimbalWaterworksWeb.UsersSessionControllerTest do
  use GuimbalWaterworksWeb.ConnCase, async: true

  import GuimbalWaterworks.AccountsFixtures

  setup do
    %{users: users_fixture()}
  end

  describe "GET /users/log_in" do
    test "renders log in page", %{conn: conn} do
      conn = get(conn, Routes.users_session_path(conn, :new))
      response = html_response(conn, 200)
      assert response =~ "<h1>Log in</h1>"
      assert response =~ "Register</a>"
      assert response =~ "Forgot your password?</a>"
    end

    test "redirects if already logged in", %{conn: conn, users: users} do
      conn = conn |> log_in_users(users) |> get(Routes.users_session_path(conn, :new))
      assert redirected_to(conn) == "/"
    end
  end

  describe "POST /users/log_in" do
    test "logs the users in", %{conn: conn, users: users} do
      conn =
        post(conn, Routes.users_session_path(conn, :create), %{
          "users" => %{"email" => users.email, "password" => valid_users_password()}
        })

      assert get_session(conn, :users_token)
      assert redirected_to(conn) == "/"

      # Now do a logged in request and assert on the menu
      conn = get(conn, "/")
      response = html_response(conn, 200)
      assert response =~ users.email
      assert response =~ "Settings</a>"
      assert response =~ "Log out</a>"
    end

    test "logs the users in with remember me", %{conn: conn, users: users} do
      conn =
        post(conn, Routes.users_session_path(conn, :create), %{
          "users" => %{
            "email" => users.email,
            "password" => valid_users_password(),
            "remember_me" => "true"
          }
        })

      assert conn.resp_cookies["_guimbal_waterworks_web_users_remember_me"]
      assert redirected_to(conn) == "/"
    end

    test "logs the users in with return to", %{conn: conn, users: users} do
      conn =
        conn
        |> init_test_session(users_return_to: "/foo/bar")
        |> post(Routes.users_session_path(conn, :create), %{
          "users" => %{
            "email" => users.email,
            "password" => valid_users_password()
          }
        })

      assert redirected_to(conn) == "/foo/bar"
    end

    test "emits error message with invalid credentials", %{conn: conn, users: users} do
      conn =
        post(conn, Routes.users_session_path(conn, :create), %{
          "users" => %{"email" => users.email, "password" => "invalid_password"}
        })

      response = html_response(conn, 200)
      assert response =~ "<h1>Log in</h1>"
      assert response =~ "Invalid email or password"
    end
  end

  describe "DELETE /users/log_out" do
    test "logs the users out", %{conn: conn, users: users} do
      conn = conn |> log_in_users(users) |> delete(Routes.users_session_path(conn, :delete))
      assert redirected_to(conn) == "/"
      refute get_session(conn, :users_token)
      assert get_flash(conn, :info) =~ "Logged out successfully"
    end

    test "succeeds even if the users is not logged in", %{conn: conn} do
      conn = delete(conn, Routes.users_session_path(conn, :delete))
      assert redirected_to(conn) == "/"
      refute get_session(conn, :users_token)
      assert get_flash(conn, :info) =~ "Logged out successfully"
    end
  end
end
