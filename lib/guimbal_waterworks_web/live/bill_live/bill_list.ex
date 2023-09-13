defmodule GuimbalWaterworksWeb.BillLive.BillList do
  use GuimbalWaterworksWeb, :live_component

  alias Decimal, as: D
  alias GuimbalWaterworks.Bills

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

  @impl true
  def update(assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(:base_params, assigns.base_params || %{})
     |> assign(:pagination_params, Page.default_pagination_params())
     |> update_results()}
  end

  # @impl true
  # def handle_event("turn_page", %{"page" => page} = _params, socket) do
  #   updated_pagination_params =
  #     Map.replace!(socket.assigns.pagination_params, "current_page", String.to_integer(page))
  #
  #   {:noreply,
  #    socket
  #    |> assign_pagination_params(updated_pagination_params)
  #    |> update_members_and_bills()}
  # end
  #
  defp assign_bills_with_calculation(socket) do
    %{
      base_params: base_params,
      pagination_params: %{
        "per_page" => limit,
        "current_page" => current_page
      }
    } = socket.assigns

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
