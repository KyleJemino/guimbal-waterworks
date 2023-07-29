defmodule GuimbalWaterworksWeb.UsersResetPasswordControllerTest do
  use GuimbalWaterworksWeb.ConnCase, async: true

  alias GuimbalWaterworks.Accounts
  alias GuimbalWaterworks.Repo
  import GuimbalWaterworks.AccountsFixtures

  setup do
    %{users: users_fixture()}
  end

  describe "GET /users/reset_password" do
    test "renders the reset password page", %{conn: conn} do
      conn = get(conn, Routes.users_reset_password_path(conn, :new))
      response = html_response(conn, 200)
      assert response =~ "<h1>Forgot your password?</h1>"
    end
  end

  describe "POST /users/reset_password" do
    @tag :capture_log
    test "sends a new reset password token", %{conn: conn, users: users} do
      conn =
        post(conn, Routes.users_reset_password_path(conn, :create), %{
          "users" => %{"email" => users.email}
        })

      assert redirected_to(conn) == "/"
      assert get_flash(conn, :info) =~ "If your email is in our system"
      assert Repo.get_by!(Accounts.UsersToken, users_id: users.id).context == "reset_password"
    end

    test "does not send reset password token if email is invalid", %{conn: conn} do
      conn =
        post(conn, Routes.users_reset_password_path(conn, :create), %{
          "users" => %{"email" => "unknown@example.com"}
        })

      assert redirected_to(conn) == "/"
      assert get_flash(conn, :info) =~ "If your email is in our system"
      assert Repo.all(Accounts.UsersToken) == []
    end
  end

  describe "GET /users/reset_password/:token" do
    setup %{users: users} do
      token =
        extract_users_token(fn url ->
          Accounts.deliver_users_reset_password_instructions(users, url)
        end)

      %{token: token}
    end

    test "renders reset password", %{conn: conn, token: token} do
      conn = get(conn, Routes.users_reset_password_path(conn, :edit, token))
      assert html_response(conn, 200) =~ "<h1>Reset password</h1>"
    end

    test "does not render reset password with invalid token", %{conn: conn} do
      conn = get(conn, Routes.users_reset_password_path(conn, :edit, "oops"))
      assert redirected_to(conn) == "/"
      assert get_flash(conn, :error) =~ "Reset password link is invalid or it has expired"
    end
  end

  describe "PUT /users/reset_password/:token" do
    setup %{users: users} do
      token =
        extract_users_token(fn url ->
          Accounts.deliver_users_reset_password_instructions(users, url)
        end)

      %{token: token}
    end

    test "resets password once", %{conn: conn, users: users, token: token} do
      conn =
        put(conn, Routes.users_reset_password_path(conn, :update, token), %{
          "users" => %{
            "password" => "new valid password",
            "password_confirmation" => "new valid password"
          }
        })

      assert redirected_to(conn) == Routes.users_session_path(conn, :new)
      refute get_session(conn, :users_token)
      assert get_flash(conn, :info) =~ "Password reset successfully"
      assert Accounts.get_users_by_email_and_password(users.email, "new valid password")
    end

    test "does not reset password on invalid data", %{conn: conn, token: token} do
      conn =
        put(conn, Routes.users_reset_password_path(conn, :update, token), %{
          "users" => %{
            "password" => "too short",
            "password_confirmation" => "does not match"
          }
        })

      response = html_response(conn, 200)
      assert response =~ "<h1>Reset password</h1>"
      assert response =~ "should be at least 12 character(s)"
      assert response =~ "does not match password"
    end

    test "does not reset password with invalid token", %{conn: conn} do
      conn = put(conn, Routes.users_reset_password_path(conn, :update, "oops"))
      assert redirected_to(conn) == "/"
      assert get_flash(conn, :error) =~ "Reset password link is invalid or it has expired"
    end
  end
end
