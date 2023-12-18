defmodule GuimbalWaterworksWeb.BillLive.FormComponent do
  use GuimbalWaterworksWeb, :live_component
  alias Ecto.Changeset

  alias GuimbalWaterworks.Bills

  def update(%{bill: bill} = assigns, socket) do
    billing_period_options =
      %{
        "with_no_bill_for_member_id" => bill.member_id,
        "order_by" => [desc: :due_date]
      }
      |> Bills.list_billing_periods()
      |> Enum.map(fn period ->
        {"#{period.month} #{period.year}", period.id}
      end)

    changeset = Bills.change_bill(bill)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:changeset, changeset)
     |> assign(:billing_period_options, billing_period_options)}
  end

  def handle_event("validate", %{"bill" => bill_params}, socket) do
    changeset =
      socket.assigns.bill
      |> Bills.change_bill(bill_params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :changeset, changeset)}
  end

  def handle_event("save", %{"bill" => bill_params}, socket) do
    save_bill(socket, socket.assigns.action, bill_params)
  end

  defp save_bill(socket, :new, bill_params) do
    case Bills.create_bill(bill_params) do
      {:ok, _bill} ->
        {:noreply,
         socket
         |> put_flash(:info, "Bill created successfully")
         |> push_redirect(to: socket.assigns.return_to)}

      {:error, %Changeset{} = changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end

  defp save_bill(socket, :edit, bill_params) do
    case Bills.update_bill(socket.assigns.bill, bill_params) do
      {:ok, _bill} ->
        {:noreply,
         socket
         |> put_flash(:info, "Bill updated successfully")
         |> push_redirect(to: socket.assigns.return_to)}

      {:error, changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end
end
