defmodule GuimbalWaterworksWeb.UsersRegistrationController do
  use GuimbalWaterworksWeb, :controller

  alias GuimbalWaterworks.Accounts
  alias GuimbalWaterworks.Accounts.Users
  alias GuimbalWaterworksWeb.UsersAuth

  plug :put_layout, "landing_page.html"

  def new(conn, _params) do
    changeset = Accounts.change_users_registration(%Users{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"users" => users_params}) do
    case Accounts.register_users(users_params) do
      {:ok, users} ->
        conn
        |> put_flash(:info, "Users created successfully. Pls wait for manager's approval.")
        |> redirect(to: Routes.users_session_path(conn, :new))
        |> halt()

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end
end
