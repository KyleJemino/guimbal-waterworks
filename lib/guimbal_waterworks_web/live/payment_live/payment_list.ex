defmodule GuimbalWaterworksWeb.PaymentLive.PaymentList do
  use GuimbalWaterworksWeb, :live_component
  alias Decimal, as: D

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Helpers
  alias GuimbalWaterworksWeb.PaymentLive.Components, as: PaymentComponents

  @valid_filter_keys [
    "last_name",
    "first_name",
    "middle_name",
    "street",
    "type",
    "or",
    "paid_from",
    "paid_to"
  ]

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
    {:noreply, assign_search_params(socket, search_params)}
  end

  @impl true
  def handle_event("filter_submit", %{"search_params" => search_params}, socket) do
    {:noreply,
     socket
     |> assign_search_params(search_params)
     |> assign_pagination_params(%{
       socket.assigns.pagination_params
       | "current_page" => 1
     })
     |> patch_params_path()}
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
    {:noreply,
     socket
     |> assign_pagination_params(%{
       "per_page" => per_page,
       "current_page" => 1
     })
     |> patch_params_path()}
  end

  @impl true
  def handle_event("turn_page", %{"page" => page} = _params, socket) do
    updated_pagination_params =
      Map.replace!(socket.assigns.pagination_params, "current_page", page)

    {:noreply,
     socket
     |> assign_pagination_params(updated_pagination_params)
     |> patch_params_path()}
  end

  defp assign_payments(socket) do
    %{
      base_params: base_params,
      filter_params: filter_params
    } = socket.assigns

    payments =
      filter_params
      |> Map.put(
        "preload",
        [:member, :user, bills: [:billing_period, :member, :payment]]
      )
      |> Map.put("order_by", "default")
      |> Map.merge(base_params)
      |> Page.pagination_to_query_params()
      |> Bills.list_payments()

    assign(socket, :payments, payments)
  end

  defp assign_payment_calculations(socket) do
    {payment_bill_map, payment_total_map, calculated_total, paid_total} =
      Enum.reduce(
        socket.assigns.payments,
        {%{}, %{}, 0, 0},
        fn
          payment, {payment_bill_map_acc, payment_total_map_acc, calculated_total_acc, paid_total_acc} ->
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
              D.add(calculated_total_acc, bills_total),
              D.add(paid_total_acc, payment.amount)
            }
        end
      )

    assign(socket, %{
      payment_bill_map: payment_bill_map,
      payment_total_map: payment_total_map,
      calculated_total: calculated_total,
      paid_total: paid_total
    })
  end

  defp assign_pagination_information(%{assigns: assigns} = socket) do
    result_count =
      assigns.base_params
      |> Map.merge(assigns.search_params)
      |> Bills.count_payments()

    display_count = Enum.count(assigns.payments)

    pagination_info =
      Page.get_pagination_info(
        assigns.pagination_params,
        result_count,
        display_count
      )

    assign(socket, :pagination, pagination_info)
  end

  defp assign_search_params(socket, search_params \\ nil) do
    current_params =
      if is_nil(search_params) do
        socket.assigns.filter_params
      else
        search_params
      end

    clean_params =
      current_params
      |> Map.take(@valid_filter_keys)
      |> Helpers.remove_empty_map_values()

    assign(socket, :search_params, clean_params)
  end

  defp assign_pagination_params(socket, pagination_params \\ nil) do
    current_params =
      if is_nil(pagination_params) do
        socket.assigns.filter_params
      else
        pagination_params
      end

    clean_params =
      current_params
      |> Map.take(Page.param_keys())
      |> Page.sanitize_pagination_params()

    assign(socket, :pagination_params, clean_params)
  end

  defp update_results(socket) do
    socket
    |> assign_payments()
    |> assign_payment_calculations()
    |> assign_pagination_information()
  end

  defp sanitize_query_params(filter_params) do
    filter_params
    |> Helpers.remove_empty_map_values()
    |> Map.take(Page.param_keys() ++ @valid_filter_keys)
    |> Map.merge(Page.default_pagination_params(), fn _k, v1, _v2 -> v1 end)
    |> Page.sanitize_pagination_params()
  end

  defp assign_filter_params(socket, filter_params) do
    assign(socket, :filter_params, sanitize_query_params(filter_params))
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
        Routes.member_show_path(socket, :payments, id, updated_filter_params)
      else
        Routes.billing_period_show_path(socket, :payments, id, updated_filter_params)
      end

    push_patch(socket, to: route)
  end
end
