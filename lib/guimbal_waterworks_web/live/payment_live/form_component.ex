defmodule GuimbalWaterworksWeb.PaymentLive.FormComponent do
  use GuimbalWaterworksWeb, :live_component
  alias Ecto.Changeset

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.Payment

  def update(
        %{
          payment:
            %Payment{
              member_id: member_id
            } = payment,
          member: member
        } = assigns,
        socket
      ) do
    changeset = Bills.change_payment(payment)

    bill_options =
      %{
        "member_id" => member_id,
        "status" => :unpaid,
        "preload" => :billing_period
      }
      |> Bills.list_bills()
      |> Enum.map(fn %{billing_period: period} = bill ->
        {:ok, %{total: bill_amount}} = Bills.calculate_bill(bill, period, member)

        %{
          label: "#{period.month} #{period.year} - PHP#{Display.money(bill_amount)}",
          value: bill.id,
          amount: bill_amount
        }
      end)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:bill_options, bill_options)
     |> assign_changeset(changeset)}
  end

  def handle_event("validate", %{"payment" => payment_params}, socket) do
    changeset =
      socket.assigns.payment
      |> Bills.change_payment(payment_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_changeset(socket, changeset)}
  end

  def handle_event("save", %{"payment" => payment_params}, socket) do
    case Bills.create_payment(payment_params) do
      {:ok, %{payment: payment}} ->
        {:noreply,
         socket
         |> put_flash(:info, "Payment successful")
         |> push_redirect(to: Routes.member_show_path(socket, :show, payment.member_id))}

      {:error, _operation, %Changeset{} = changeset, _changes} ->
        {:noreply, assign_changeset(socket, changeset)}

      _ ->
        {:noreply, socket}
    end
  end

  defp update_total(socket) do
    %{changeset: changeset, bill_options: bill_options} = socket.assigns
    IO.inspect changeset

    selected_bills = Changeset.get_field(changeset, :bill_ids, [])  

    IO.inspect selected_bills

    total_amount = 
      Enum.reduce(bill_options, 0, fn bill, total ->
        addition_to_total = if bill.value in selected_bills, do: bill.amount, else: 0

        Decimal.add(total, addition_to_total)  
      end)

    assign(socket, :total_amount, total_amount)
  end

  defp assign_changeset(socket, changeset) do
    socket
    |> assign(:changeset, changeset)
    |> update_total()
  end
end
