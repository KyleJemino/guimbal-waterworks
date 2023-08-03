defmodule GuimbalWaterworksWeb.EmployeeLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Accounts

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(params, _url, socket) do
    IO.inspect params
    {:noreply,
     socket
     |> apply_action(socket.assigns.live_action, params)
     |> assign_employees()}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Employee List")
  end

  def handle_event("approve_employee", %{"employee_id" => employee_id}, socket) do
    employee = Accounts.get_users!(employee_id)
    case Accounts.approve_user(employee) do
      {:ok, _employee} ->
        {:noreply, assign_employees(socket)}
      _ ->
        {:noreply,
          put_flash(socket, :error, "Something went wrong")
        }
    end
    {:noreply, socket}
  end

  defp assign_employees(socket) do
    employees = 
      Accounts.list_users(%{
        "order_by" => [asc_nulls_first: :approved_at]
      })
    assign(socket, :employees, employees)
  end
end
