defmodule GuimbalWaterworksWeb.EmployeeLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Accounts
  alias Accounts.Users

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(params, _url, socket) do
    {:noreply,
     socket
     |> apply_action(socket.assigns.live_action, params)
     |> assign_employees()}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Employee List")
    |> assign(:employee, nil)
  end

  defp apply_action(socket, :role_change, %{"employee_id" => employee_id}) do
    case Accounts.get_users!(employee_id) do
      %Users{role: :manager, id: employee_id} 
      when employee_id != socket.assigns.current_users.id ->
        socket
        |> put_flash(:error, "Invalid action")
        |> push_patch(to: Routes.employee_index_path(socket, :index))
      %Users{} = employee ->
        socket
        |> assign(:page_title, "Edit Employee Role")
        |> assign(:employee, employee)
    end
  end

  def handle_event("approve_employee", %{"employee_id" => employee_id}, socket) do
    employee = Accounts.get_users!(employee_id)

    case Accounts.approve_user(employee) do
      {:ok, _employee} ->
        {:noreply,
         socket
         |> put_flash(:info, "Employee approved!")
         |> assign_employees()}

      _ ->
        {:noreply, put_flash(socket, :error, "Something went wrong")}
    end
  end

  def handle_event("remove_employee", %{"employee_id" => employee_id}, socket) do
    employee = Accounts.get_users!(employee_id)

    case Accounts.archive_user(employee) do
      {:ok, _employee} ->
        {:noreply,
         socket
         |> put_flash(:info, "Employee deleted!")
         |> assign_employees()}

      _ ->
        {:noreply, put_flash(socket, :error, "Something went wrong")}
    end
  end

  defp assign_employees(socket) do
    employees =
      Accounts.list_users(%{
        "order_by" => [asc_nulls_first: :approved_at]
      })

    assign(socket, :employees, employees)
  end
end
