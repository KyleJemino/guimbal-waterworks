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

  @initial_payment_breakdown %{
    current: 0,
    overdue: 0,
    billing_periods: "",
    surcharges: 0,
    death_aid: 0,
    franchise_tax: 0,
    membership_and_advance_fee: 0,
    reconnection_fee: 0,
    total: 0
  }

  @initial_all_payments_breakdown Map.put(@initial_payment_breakdown, :total_paid, 0)

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

  @impl true
  def handle_event("generate_csv", _params, socket) do
    {:noreply, push_event(socket, "generate", %{data: socket.assigns.table_data})}
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
        [
          :member,
          :user,
          bills: [
            billing_period: [:rate]
          ]
        ]
      )
      |> Map.put("order_by", "default")
      |> Map.merge(base_params)
      |> Page.pagination_to_query_params()
      |> Bills.list_payments()

    assign(socket, :payments, payments)
  end

  defp assign_table_data(socket) do
    {reversed_payment_rows, all_payments_breakdown} =
      Enum.reduce(
        socket.assigns.payments,
        {[], @initial_all_payments_breakdown},
        fn payment, acc ->
          {rows_acc, running_all_payments_breakdown} = acc

          payment_breakdown =
            Enum.reduce(
              payment.bills,
              @initial_payment_breakdown,
              fn bill, running_data ->
                update_payment_breakdown(running_data, bill, payment)
              end
            )

          payment_information = %{
            member: Display.full_name(payment.member),
            address: payment.member.street,
            or: payment.or,
            paid_at: Display.format_date(payment.paid_at),
            cashier: Display.full_name(payment.user),
            total_paid: payment.amount
          }

          payment_row = Map.merge(payment_information, payment_breakdown)

          %{}

          updated_all_payments_breakdown =
            running_all_payments_breakdown
            |> Map.update!(:current, fn val ->
              D.add(val, payment_breakdown.current)
            end)
            |> Map.update!(:overdue, fn val ->
              D.add(val, payment_breakdown.overdue)
            end)
            |> Map.update!(:surcharges, &D.add(&1, payment_breakdown.surcharges))
            |> Map.update!(:franchise_tax, &D.add(&1, payment_breakdown.franchise_tax))
            |> Map.update!(:death_aid, &D.add(&1, payment_breakdown.death_aid))
            |> Map.update!(:reconnection_fee, &D.add(&1, payment_breakdown.reconnection_fee))
            |> Map.update!(
              :membership_and_advance_fee,
              &D.add(&1, payment_breakdown.membership_and_advance_fee)
            )
            |> Map.update!(:total, &D.add(&1, payment_breakdown.total))
            |> Map.update!(:total_paid, &D.add(&1, payment.amount))

          {[payment_row | rows_acc], updated_all_payments_breakdown}
        end
      )

    total_row_info = %{
      member: "ALL",
      address: "",
      or: "",
      paid_at: "",
      cashier: ""
    }

    total_row = Map.merge(total_row_info, all_payments_breakdown)

    table_data =
      reversed_payment_rows
      |> List.insert_at(0, total_row)
      |> Enum.reverse()

    assign(socket, :table_data, table_data)
  end

  defp update_payment_breakdown(breakdown, bill, payment) do
    %{
      billing_period: billing_period
    } = bill

    {:ok, calculation_data} =
      Bills.calculate_bill(
        bill,
        billing_period,
        payment.member,
        payment,
        billing_period.rate
      )

    %{
      base_amount: base,
      franchise_tax_amount: tax,
      membership_amount: membership,
      reconnection_amount: reconnection,
      surcharge: surcharge,
      death_aid_amount: death_aid,
      total: total
    } = calculation_data

    breakdown
    |> Map.update!(:current, fn val ->
      if Bills.late_payment?(payment, billing_period) do
        val
      else
        D.add(val, base)
      end
    end)
    |> Map.update!(:overdue, fn val ->
      if Bills.late_payment?(payment, billing_period) do
        D.add(val, base)
      else
        val
      end
    end)
    |> Map.update!(:surcharges, &D.add(&1, surcharge))
    |> Map.update!(:franchise_tax, &D.add(&1, tax))
    |> Map.update!(:death_aid, &D.add(&1, death_aid))
    |> Map.update!(:reconnection_fee, &D.add(&1, reconnection))
    |> Map.update!(:membership_and_advance_fee, &D.add(&1, membership))
    |> Map.update!(:billing_periods, fn val ->
      abbreviated = Helpers.abbreviate_month(billing_period.month)

      case val do
        "" -> abbreviated
        val -> "#{val}/#{abbreviated}"
      end
    end)
    |> Map.update!(:total, &D.add(&1, total))
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
    |> assign_table_data()
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
      case for do
        :member ->
          Routes.member_show_path(socket, :payments, id, updated_filter_params)

        :billing_period ->
          Routes.billing_period_show_path(socket, :payments, id, updated_filter_params)

        _ ->
          Routes.payment_index_path(socket, :index, updated_filter_params)
      end

    push_patch(socket, to: route)
  end
end
