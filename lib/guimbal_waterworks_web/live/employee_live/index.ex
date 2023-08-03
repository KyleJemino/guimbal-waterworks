defmodule GuimbalWaterworksWeb.EmployeeLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Accounts

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(_params, _url, socket) do
    {:noreply,
     socket
     |> assign(:page_title, Atom.to_string(socket.assigns.live_action))
     |> assign_employees()}
  end

  defp assign_employees(socket) do
    employees = 
      Accounts.list_users(%{
        "order_by" => [asc_nulls_first: :approved_at]
      })
    assign(socket, :employees, employees)
  end
end
