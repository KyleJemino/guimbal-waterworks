defmodule GuimbalWaterworksWeb.RequestController do
  use GuimbalWaterworksWeb, :controller

  alias GuimbalWaterworks.Accounts
  alias GuimbalWaterworks.Requests.Request
  alias Accounts.Users

  def forgot_password(conn, params) do
  end

  def forgot_password_token(conn, %{"password" => password_params}) do
    %{
      "user_id" => _user_id,
      "password" => _password,
      "password_confirmation" => _password_confirmation
    } = password_params

    render(conn, "forgot_password_user.html", error_message: "User doesn't exist")
  end
end
