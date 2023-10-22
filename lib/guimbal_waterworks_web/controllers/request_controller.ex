defmodule GuimbalWaterworksWeb.RequestController do
  use GuimbalWaterworksWeb, :controller

  alias GuimbalWaterworks.Accounts
  alias Accounts.Users

  def forgot_password_user(conn, _params) do
    render(conn, "forgot_password_user.html", error_message: nil)
  end

  def forgot_password_change(conn, params) do
    %{"user" => %{ "username" => username }} = params 

    case Accounts.get_users_by_username(username) do
      %Users{id: user_id} ->
        render(conn, "forgot_password_change.html", user_id: user_id)
      _ ->
        render(conn, "forgot_password_user.html", error_message: "User doesn't exist")
    end
  end

  def forgot_password_token(conn, %{"password" => password_change_params}) do
    IO.inspect(password_change_params) 
    render(conn, "forgot_password_change.html", user_id: password_change_params.user_id)
  end
end
