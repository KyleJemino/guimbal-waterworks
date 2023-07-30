defmodule GuimbalWaterworksWeb.UsersRegistrationController do
  use GuimbalWaterworksWeb, :controller

  alias GuimbalWaterworks.Accounts
  alias GuimbalWaterworks.Accounts.Users
  alias GuimbalWaterworksWeb.UsersAuth

  def new(conn, _params) do
    changeset = Accounts.change_users_registration(%Users{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"users" => users_params}) do
    case Accounts.register_users(users_params) do
      {:ok, users} ->
        conn
        |> put_flash(:info, "Users created successfully.")
        |> UsersAuth.log_in_users(users)

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end
end
