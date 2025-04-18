defmodule GuimbalWaterworksWeb.BillLive.BillList do
  use GuimbalWaterworksWeb, :live_component

  alias Decimal, as: D
  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Helpers
  alias GuimbalWaterworksWeb.BillLive.Components, as: BillComponents

  @init_calculation_map %{
    base_amount: 0,
    franchise_tax_amount: 0,
    membership_amount: 0,
    reconnection_amount: 0,
    surcharge: 0,
    death_aid_amount: 0,
    member_discount: 0,
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
    "status"
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
  def render(assigns) do
    ~H"""
    <div class="flex flex-col py-3 gap-3">
      <div class="px-2">
        <BillComponents.filter_form
          target={@myself}
          search_params={@search_params}
          for={@for}
        />
      </div>
      <div class="px-2">
        <Page.pagination_count_select
          target={@myself}
          pagination_params={@pagination_params}
          pagination={@pagination}
        />
      </div>
      <div class="overflow-auto">
      <table class="data-table">
        <tr class="header-row">
          <th class="header">
            <%= if @for == :member do %>
              Billing Period
            <% end %>
            <%= if @for == :billing_period do %>
              Member
            <% end %>
          </th>
          <th class="header">Before (Cu. M.)</th>
          <th class="header">After (Cu. M.)</th>
          <th class="header">Employee Discount (Cu. M.)</th>
          <th class="header">Reading (Cu.M.)</th>
          <th class="header">Base Amount</th>
          <th class="header">Discount</th>
          <th class="header">Franchise Tax</th>
          <th class="header">Membership Fee</th>
          <th class="header">Reconnection Fee</th>
          <th class="header">Surcharge Fee</th>
          <th class="header">Death Aid</th>
          <th class="header">Total</th>
          <th class="header">Payment Status</th>
          <th class="header">Actions</th>
        </tr>
        <%= for bill <- @bills do %>
          <tr class="data-row">
            <td class="data">
              <%= if @for == :member do %>
                <%= Display.display_period(bill.billing_period) %>
              <% end %>
              <%= if @for == :billing_period do %>
                <%= Display.full_name(bill.member) %>
              <% end %>
            </td>
            <td class="data text-right"><%= Decimal.round(bill.before, 2) %></td>
            <td class="data text-right"><%= Decimal.round(bill.after, 2) %></td>
            <td class="data text-right"><%= Decimal.round(bill.discount, 2) %></td>
            <td class="data text-right"><%= Decimal.round(Bills.get_bill_reading(bill)) %></td>
            <td class="data text-right"><%= Display.money(bill.calculation.base_amount) %></td>
            <td class="data text-right"><%= Display.money(bill.calculation.member_discount) %></td>
            <td class="data text-right"><%= Display.money(bill.calculation.franchise_tax_amount) %></td>
            <td class="data text-right"><%= Display.money(bill.calculation.membership_amount) %></td>
            <td class="data text-right"><%= Display.money(bill.calculation.reconnection_amount) %></td>
            <td class="data text-right"><%= Display.money(bill.calculation.surcharge) %></td>
            <td class="data text-right"><%= Display.money(bill.calculation.death_aid_amount) %></td>
            <td class="data text-right"><%= Display.money(bill.calculation.total) %></td>
            <td class="data">
              <%= if not is_nil(bill.payment), do: "PAID", else: "UNPAID" %>
            </td>
            <td class="data text-center">
              <SC.pop_up_menu target_id={bill.id}>
                <%= if @for == :member do %>
                  <%= live_redirect "Go to #{Display.display_period(bill.billing_period)}", to: Routes.billing_period_show_path(@socket, :show, bill.billing_period.id) %>
                <% end %>
                <%= if @for == :billing_period do %>
                  <%= live_redirect "Go to #{Display.full_name(bill.member)}", to: Routes.member_show_path(@socket, :show, bill.member.id) %>
                <% end %>
                <SC.render_for_roles roles={[:cashier]} user={@current_users}>
                  <%= live_redirect "Pay Bills", to: Routes.member_index_path(@socket, :payment, bill.member), class: "" %>
                </SC.render_for_roles>
                <SC.render_for_roles roles={[:admin]} user={@current_users}>
                  <button
                    phx-click="edit_bill"
                    phx-value-bill-id={bill.id}
                    phx-target={@myself}
                    >
                    Edit Bill
                  </button>
                </SC.render_for_roles>
              </SC.pop_up_menu>
            </td>
          </tr>
      <% end %>
        <tr class="total-row">
            <td class="data">Total</td>
            <td class="data text-right"></td>
            <td class="data text-right"></td>
            <td class="data text-right"></td>
            <td class="data text-right"></td>
            <td class="data text-right"><%= Display.money(@total_prices.base_amount) %></td>
            <td class="data text-right"><%= Display.money(@total_prices.member_discount) %></td>
            <td class="data text-right"><%= Display.money(@total_prices.franchise_tax_amount) %></td>
            <td class="data text-right"><%= Display.money(@total_prices.membership_amount) %></td>
            <td class="data text-right"><%= Display.money(@total_prices.reconnection_amount) %></td>
            <td class="data text-right"><%= Display.money(@total_prices.surcharge) %></td>
            <td class="data text-right"><%= Display.money(@total_prices.death_aid_amount) %></td>
            <td class="data text-right"><%= Display.money(@total_prices.total) %></td>
            <td class="data"></td>
            <td class="data"></td>
        </tr>
      </table>
      </div>
      <Page.pagination_buttons
        target={@myself}
        pagination_params={@pagination_params}
        pagination={@pagination}
      />
    </div>
    """
  end

  @impl true
  def handle_event("filter_change", %{"search_params" => search_params}, socket) do
    {:noreply, assign_search_params(socket, search_params)}
  end

  @impl true
  def handle_event("filter_submit", _params, socket) do
    {:noreply,
     socket
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
  def handle_event("edit_bill", %{"bill-id" => bill_id} = _params, socket) do
    send(
      self(),
      {
        socket.assigns.edit_event_name,
        bill_id
      }
    )

    {:noreply, socket}
  end

  defp assign_bills_with_calculation(socket) do
    %{
      base_params: base_params,
      filter_params: filter_params
    } = socket.assigns

    list_params =
      filter_params
      |> Map.put("preload", [:payment, :member, billing_period: [:rate]])
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
    |> Map.merge(Page.default_pagination_params(), fn _k, v1, _v2 -> v1 end)
    |> Page.sanitize_pagination_params()
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

    updated_filter_params =
      search_params
      |> Map.merge(pagination_params)
      |> sanitize_query_params()

    route =
      if for == :member do
        Routes.member_show_path(socket, :show, base_params["member_id"], updated_filter_params)
      else
        Routes.billing_period_show_path(
          socket,
          :show,
          base_params["billing_period_id"],
          updated_filter_params
        )
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
      socket.assigns.filter_params
      |> Map.take(@pagination_keys)
      |> Page.sanitize_pagination_params()
    )
  end

  defp assign_pagination_params(socket, pagination_params) do
    assign(
      socket,
      :pagination_params,
      Page.sanitize_pagination_params(pagination_params)
    )
  end
end
