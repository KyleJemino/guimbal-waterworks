defmodule GuimbalWaterworksWeb.BillLive.BillList do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Bills

  def update(assigns, socket) do
    {:ok,
      socket
      |> assign(assigns)
      |> assign(:base_params, assigns.base_params || %{})
      |> assign_bills()
    }
  end

  defp assign_bills_total(socket) do
    list_params =
      socket.assigns.base_params
      |> Map.put("preload", [:billing_period, :member, :payment])


    bills_with_calculation =
      list_params
      |> Bills.list_bills()
      |> Enum.map(fn bill ->
        {:ok, calculation} = Bills.calculate_bill(bill, bill.billing_period, bill.member)
        Map.put(
          bill,
          :calculation,
          calculation
        )
      end)
    
    assign(
      socket,
      :bills,
      bills_with_calculation
    )
  end
end
