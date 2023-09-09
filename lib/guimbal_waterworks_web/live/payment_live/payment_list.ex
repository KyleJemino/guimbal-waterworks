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
          bills: [:billing_period, :member]
        ]
      )
      |> Bills.list_payments()

    assign(socket, :payments, payments)
  end

  defp update_results(socket) do
    socket
    |> assign_payments()
  end
end
