defmodule GuimbalWaterworksWeb.PaymentLive.PaymentList do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Bills
  alias Decimal, as: D

  def update(assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(:base_params, assigns.base_params || %{})
     |> update_results()}
  end

  defp assign_payments(socket) do
    payments =
      socket.assigns.base_params
      |> Map.put(
        "preload",
        [:member, :user, bills: [:billing_period, :member, :payment]]
      )
      |> Bills.list_payments()

    assign(socket, :payments, payments)
  end

  defp assign_payment_calculations(socket) do
    {payment_bill_map, payment_total_map, total_amount} =
      Enum.reduce(
        socket.assigns.payments,
        {%{}, %{}, 0},
        fn
          payment, {payment_bill_map_acc, payment_total_map_acc, total_acc} ->
            {bills_map, bills_total} =
              Enum.reduce(payment.bills, {%{}, 0}, fn bill, {bill_map_acc, payment_amount} ->
                bill_total = Bills.get_bill_total(bill)

                bill_map =
                  Map.put(
                    bill_map_acc,
                    Display.display_period(bill.billing_period),
                    bill_total
                  )

                {bill_map, D.add(payment_amount, bill_total)}
              end)

            {
              Map.put(payment_bill_map_acc, payment.id, bills_map),
              Map.put(payment_total_map_acc, payment.id, bills_total),
              D.add(total_acc, bills_total)
            }
        end
      )

    assign(socket, %{
      payment_bill_map: payment_bill_map,
      payment_total_map: payment_total_map,
      total: total_amount
    })
  end

  defp update_results(socket) do
    socket
    |> assign_payments()
    |> assign_payment_calculations()
  end
end
