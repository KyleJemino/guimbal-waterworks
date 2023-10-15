defmodule GuimbalWaterworksWeb.EmployeeLive.RoleFormComponent do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Accounts

  def update(%{employee: employee} = assigns, socket) do
    changeset = Accounts.change_user_role(employee)

    {:ok,
      socket
      |> assign(assigns)
      |> assign(:changeset, changeset)
    }
  end
end
