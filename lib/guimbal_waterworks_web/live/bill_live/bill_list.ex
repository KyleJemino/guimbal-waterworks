defmodule GuimbalWaterworksWeb.BillLive.BillList do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Bills
  alias Decimal, as: D

  @init_calculation_map %{
    base_amount: 0,
    franchise_tax_amount: 0,
    adv_amount: 0,
    membership_amount: 0,
    reconnection_amount: 0,
    surcharge: 0,
    death_aid_amount: 0,
    total: 0
  }

  def update(assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(:base_params, assigns.base_params || %{})
     |> update_results()}
  end

  defp assign_bills_with_calculation(socket) do
    list_params =
      socket.assigns.base_params
      |> Map.put("preload", [:billing_period, :member, :payment])

    bills_with_calculation =
      list_params
      |> Bills.list_bills()
      |> Enum.map(fn bill ->
        {:ok, calculation} =
          Bills.calculate_bill(bill, bill.billing_period, bill.member, bill.payment)

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

  defp assign_total_calculation(%{assigns: %{bills: bills}} = socket) do
    total_price_map =
      Enum.reduce(bills, @init_calculation_map, fn %{calculation: calculation}, acc ->
        Enum.reduce(acc, acc, fn
          {key, value}, acc ->
            Map.update!(acc, key, fn current -> D.add(current, Map.fetch!(calculation, key)) end)
        end)
      end)

    assign(
      socket,
      :total_prices,
      total_price_map
    )
  end

  defp update_results(socket) do
    socket
    |> assign_bills_with_calculation()
    |> assign_total_calculation()
  end
end
