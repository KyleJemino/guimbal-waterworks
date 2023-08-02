defmodule GuimbalWaterworksWeb.EmployeeLive.Index do
  use GuimbalWaterworksWeb, :live_view 

  alias GuimbalWaterworks.Accounts

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(_params, _url, socket) do
    {:noreply, 
      socket
      |> assign_employees()
    }
  end

  defp assign_employees(socket) do
    assign(socket, :employees, Accounts.list_users())
  end
end
