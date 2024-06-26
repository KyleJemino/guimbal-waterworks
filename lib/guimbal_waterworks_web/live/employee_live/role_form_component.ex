defmodule GuimbalWaterworksWeb.EmployeeLive.RoleFormComponent do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Accounts
  alias GuimbalWaterworks.Helpers

  @role_options Accounts.Users.roles() |> Helpers.generate_options_from_atoms()

  def update(%{employee: employee} = assigns, socket) do
    changeset = Accounts.change_user_role(employee)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:employee, employee)
     |> assign(:changeset, changeset)
     |> assign(:role_options, @role_options)}
  end

  def handle_event("validate", %{"users" => user_params}, socket) do
    changeset = Accounts.change_user_role(socket.assigns.employee, user_params)

    {:noreply, assign(socket, changeset: changeset)}
  end

  def handle_event("save", %{"users" => user_params}, socket) do
    case Accounts.update_user_role(socket.assigns.employee, user_params) do
      {:ok, _user} ->
        {:noreply,
         socket
         |> put_flash(:info, "Changed role successfully")
         |> push_redirect(to: socket.assigns.return_to)}

      {:error, changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end
end
