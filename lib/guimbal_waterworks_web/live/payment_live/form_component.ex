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
            } = payment
        } = assigns,
        socket
      ) do
    changeset = payment_changeset_fn(payment, assigns.action)

    bills =
      Bills.list_bills(%{
        "member_id" => member_id,
        "status" => "unpaid",
        "preload" => [:payment, :member, billing_period: [:rate]],
        "order_by" => "oldest_first"
      })

    {bills_display, payment_options} =
      Enum.reduce(bills, {[], []}, fn
        bill, acc ->
          %{billing_period: period} = bill
          {bills_display_acc, payment_options_acc} = acc

          {:ok, %{total: bill_amount}} =
            Bills.calculate_bill(bill, bill.billing_period, bill.member, bill.payment)

          bill_name = "#{period.month} #{period.year}"

          curr_bills_display = "#{bill_name} - PHP#{Display.money(bill_amount)}"

          curr_payment_option =
            case payment_options_acc do
              [head | _tail] ->
                total_amount = Decimal.add(head.total_amount, bill_amount)

                %{
                  billing_periods: "#{head.billing_periods}, #{bill_name}",
                  total_amount: total_amount,
                  bill_ids: "#{head.bill_ids},#{bill.id}"
                }

              [] ->
                %{
                  billing_periods: bill_name,
                  total_amount: bill_amount,
                  bill_ids: bill.id
                }
            end

          {
            [curr_bills_display | bills_display_acc],
            [curr_payment_option | payment_options_acc]
          }
      end)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:bills_display, Enum.reverse(bills_display))
     |> assign(:payment_options, Enum.reverse(payment_options))
     |> assign_changeset(changeset)}
  end

  def handle_event("validate", %{"payment" => payment_params}, socket) do
    changeset =
      socket.assigns.payment
      |> payment_changeset_fn(payment_params, socket.assigns.action)
      |> Map.put(:action, :validate)

    {:noreply, assign_changeset(socket, changeset)}
  end

  def handle_event("save", %{"payment" => payment_params}, socket) do
    case save_payment(payment_params, socket) do
      {:ok, %{payment: payment}} ->
        {:noreply,
         socket
         |> put_flash(:info, "Payment successful")
         |> push_redirect(to: Routes.member_show_path(socket, :show, payment.member_id))}

      {:ok, %Payment{} = payment} ->
        {:noreply,
         socket
         |> put_flash(:info, "Payment edit successful")
         |> push_redirect(to: Routes.member_show_path(socket, :show, payment.member_id))}

      {:error, _operation, %Changeset{} = changeset, _changes} ->
        {:noreply, assign_changeset(socket, changeset)}

      _ ->
        {:noreply, socket}
    end
  end

  defp save_payment(params, socket) do
    if socket.assigns.action == :new do
      Bills.create_payment(params)
    else
      Bills.edit_payment(socket.assigns.payment, params)
    end
  end

  defp assign_changeset(socket, changeset) do
    assign(socket, :changeset, changeset)
  end

  defp payment_changeset_fn(payment, attrs \\ %{}, action)

  defp payment_changeset_fn(payment, attrs, :edit), do: Payment.edit_changeset(payment, attrs)

  defp payment_changeset_fn(payment, attrs, :new), do: Payment.changeset(payment, attrs)
end
