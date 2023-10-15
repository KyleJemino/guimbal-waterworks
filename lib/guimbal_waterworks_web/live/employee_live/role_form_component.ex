defmodule GuimbalWaterworksWeb.EmployeeLive.RoleFormComponent do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Accounts

  def update(%{employee: employee} = assigns, socket) do
    {:ok,
      socket
      |> assign(assigns)
      |> assign(:employee, employee)
    }
  end
end
