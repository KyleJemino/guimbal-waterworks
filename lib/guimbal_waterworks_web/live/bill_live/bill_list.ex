defmodule GuimbalWaterworksWeb.BillLive.BillList do
  use GuimbalWaterworksWeb, :live_component

  alias Decimal, as: D
  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Helpers
  alias GuimbalWaterworksWeb.BillLive.Components, as: BillComponents

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

  @valid_filter_keys [
    "last_name",
    "first_name",
    "middle_name",
    "street",
    "type", 
    "due_from",
    "due_to",
    "status",
  ]

  @pagination_keys [
    "per_page",
    "current_page"
  ]

  @impl true
  def update(assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(:base_params, assigns.base_params || %{})
     |> assign_filter_params(assigns.filter_params)
     |> assign_search_params()
     |> assign_pagination_params()
     |> update_results()}
  end

  @impl true
  def handle_event("filter_change", %{"search_params" => search_params}, socket) do
    {:noreply,
      socket
      |> assign_search_params(search_params)
    }
  end

  @impl true
  def handle_event("filter_submit", %{"search_params" => search_params}, socket) do
    {:noreply, patch_params_path(socket)}
  end

  @impl true
  def handle_event(
        "per_page_change",
        %{
          "pagination_params" => %{
            "per_page" => per_page
          }
        },
        socket
      ) do
    formatted_per_page =
      if per_page == "All" do
        per_page
      else
        String.to_integer(per_page)
      end

    formatted_pagination_params = %{
      "per_page" => formatted_per_page,
      "current_page" => 1
    }

    {:noreply, socket}
  end

  @impl true
  def handle_event("turn_page", %{"page" => page} = _params, socket) do
    updated_pagination_params =
      Map.replace!(socket.assigns.pagination_params, "current_page", String.to_integer(page))

    {:noreply, socket}
  end

  defp assign_bills_with_calculation(socket) do
    %{
      base_params: base_params,
      filter_params: filter_params,
    } = socket.assigns

    list_params =
      filter_params
      |> Map.put("preload", [:billing_period, :member, :payment])
      |> Map.put("order_by", "default")
      |> Map.merge(base_params)
      |> Page.pagination_to_query_params()

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
          {key, _value}, acc ->
            Map.update!(acc, key, fn current -> D.add(current, Map.fetch!(calculation, key)) end)
        end)
      end)

    assign(
      socket,
      :total_prices,
      total_price_map
    )
  end

  defp assign_pagination_information(%{assigns: assigns} = socket) do
    result_count =
      assigns.filter_params
      |> sanitize_query_params()
      |> Map.merge(assigns.base_params)
      |> Bills.count_bills()

    display_count = Enum.count(assigns.bills)

    pagination_info =
      Page.get_pagination_info(
        assigns.filter_params,
        result_count,
        display_count
      )

    assign(socket, :pagination, pagination_info)
  end

  defp sanitize_query_params(filter_params) do
    filter_params
    |> Helpers.remove_empty_map_values()
    |> Map.take(@pagination_keys ++ @valid_filter_keys)
    |> Map.merge(Page.default_pagination_params, fn _k, v1, _v2 -> v1 end)
  end

  defp assign_filter_params(socket, filter_params) do
    sanitized_params = sanitize_query_params(filter_params)

    assign(socket, :filter_params, sanitized_params)
  end

  defp update_results(socket) do
    socket
    |> assign_bills_with_calculation()
    |> assign_total_calculation()
    |> assign_pagination_information()
  end

  defp patch_params_path(socket) do
    %{ 
      assigns: %{ 
        for: for, 
        base_params: base_params, 
        search_params: search_params,
        pagination_params: pagination_params
      } 
    } = socket

    id =
      if for == :member do
        base_params["member_id"]
      else
        base_params["billing_period_id"]
      end

    updated_filter_params =
      search_params
      |> Map.merge(pagination_params)
      |> sanitize_query_params()

    route =
      if for == :member do
        Routes.member_show_path(socket, :show, base_params["member_id"], updated_filter_params)
      else
        Routes.billing_period_show_path(socket, :show, base_params["billing_period_id"], updated_filter_params)
      end

    push_patch(socket, to: route)
  end

  defp assign_search_params(socket, search_params \\ nil) do
    params =
      if is_nil(search_params) do
        Map.take(socket.assigns.filter_params, @valid_filter_keys)
      else
        search_params
      end

    assign(socket, :search_params, params)
  end

  defp assign_pagination_params(socket) do
    assign(
      socket, 
      :pagination_params, 
      Map.take(socket.assigns.filter_params, @pagination_keys)
    )
  end
end
