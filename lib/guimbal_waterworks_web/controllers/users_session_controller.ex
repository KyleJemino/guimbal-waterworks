defmodule GuimbalWaterworksWeb.UsersSessionController do
  use GuimbalWaterworksWeb, :controller

  alias GuimbalWaterworks.Accounts
  alias GuimbalWaterworksWeb.UsersAuth

  def new(conn, _params) do
    render(conn, "new.html", error_message: nil)
  end

  def create(conn, %{"users" => users_params}) do
    %{"username" => username, "password" => password} = users_params

    if users = Accounts.get_users_by_username_and_password(username, password) do
      UsersAuth.log_in_users(conn, users, users_params)
    else
      # In order to prevent user enumeration attacks, don't disclose whether the email is registered.
      render(conn, "new.html", error_message: "Invalid username or password")
    end
  end

  def delete(conn, _params) do
    IO.inspect conn
    conn
    |> put_flash(:info, "Logged out successfully.")
    |> UsersAuth.log_out_users()
  end
end
