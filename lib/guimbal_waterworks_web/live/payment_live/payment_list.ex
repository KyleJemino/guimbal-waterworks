defmodule GuimbalWaterworksWeb.PaymentLive.PaymentList do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Bills
  alias Decimal, as: D

  def update(assigns, socket) do
    {:ok,
      socket
      |> assign(assigns)
      |> assign(:base_params, assigns.base_params || %{})
      |> update_results()
    }
  end

  defp assign_payments(socket) do
    payments =
      socket.assigns.base_params
      |> Map.put("preload", 
        [:member, :user, 
          bills: [:billing_period, :member, :payment]
        ]
      )
      |> Bills.list_payments()

    assign(socket, :payments, payments)
  end

  # defp assign_payment_bill_map(socket) do
  #   {payment_bill_map, total_amount} =
  #     Enum.reduce(
  #       socket.assigns.payments, {%{}, 0}, fn
  #         payment, { payment_bill_map_acc, payment_total_acc } ->
  #           {bill_map, total_payment_acc} =
  #             Enum.reduce(payment.bills, {%{}, 0}, 
  #               fn bill, {bill_map_acc, payment_amount}->
  #                    
  #               end
  #             ) 
  #       end
  #     )
  # end

  defp update_results(socket) do
    socket
    |> assign_payments()
  end
end
