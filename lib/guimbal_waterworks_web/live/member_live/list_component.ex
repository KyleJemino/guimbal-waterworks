defmodule GuimbalWaterworksWeb.MemberLive.ListComponent do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Bills

  @default_search_params %{
    "first_name" => "",
    "middle_name" => "",
    "last_name" => "",
    "unique_identifier" => "",
    "street" => "",
    "type" => "all"
  }

  @default_pagination_params %{
    "per_page" => 20,
    "current_page" => 1
  }

  @impl true
  def update(assigns, socket) do
    search_params =
      if Map.has_key?(assigns, :search_params) do
        assigns.search_params
      else
        @default_search_params
      end

    pagination_params =
      if Map.has_key?(assigns, :pagination_params) do
        assigns.pagination_params
      else
        @default_pagination_params
      end

    base_params = %{
      "preload" => [bills: bill_preload_query()]
    }

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:base_params, base_params)
     |> assign_search_params(search_params)
     |> assign_pagination_params(pagination_params)
     |> update_members_and_bills()}
  end

  @impl true

  def handle_event("filter_change", %{"search_params" => search_params}, socket) do
    {:noreply,
     socket
     |> assign_search_params(search_params)
     |> update_members_and_bills()}
  end

  defp assign_search_params(socket, search_params) do
    assign(socket, :search_params, search_params)
  end

  defp assign_pagination_params(socket, pagination_params) do
    assign(socket, :pagination_params, pagination_params)
  end

  defp assign_members(
         %{
           assigns: %{
             base_params: base_params,
             search_params: search_params,
             pagination_params: %{
               "per_page" => limit,
               "current_page" => current_page
             }
           }
         } = socket
       ) do
    search_params_with_values =
      search_params
      |> Enum.filter(fn {_key, value} ->
        not is_nil(value) and value !== ""
      end)
      |> Map.new()

    pagination_query_params = %{
      "limit" => limit,
      "offset" => limit * (current_page - 1)
    }

    list_params =
      base_params
      |> Map.merge(search_params_with_values)
      |> Map.merge(pagination_query_params)

    members = Members.list_members(list_params)

    assign(socket, :members, members)
  end

  defp assign_member_bill_map(%{assigns: %{members: members}} = socket) do
    member_bill_map =
      Enum.reduce(members, %{}, fn member, member_map_acc ->
        initial_bills_with_amount = %{
          total: 0,
          period_amount_map: %{}
        }

        bills_with_amount =
          Enum.reduce(member.bills, initial_bills_with_amount, fn bill, bill_acc ->
            %{
              total: running_total,
              period_amount_map: period_amount_map
            } = bill_acc

            {:ok, %{total: current_bill_amount}} =
              Bills.calculate_bill(bill, bill.billing_period, member)

            %{
              total: Decimal.add(running_total, current_bill_amount),
              period_amount_map:
                Map.put(
                  period_amount_map,
                  Display.display_period(bill.billing_period),
                  current_bill_amount
                )
            }
          end)

        Map.put(member_map_acc, member.id, bills_with_amount)
      end)

    assign(socket, :member_bill_map, member_bill_map)
  end

  defp update_members_and_bills(socket) do
    socket
    |> assign_members()
    |> assign_member_bill_map()
  end

  defp bill_preload_query do
    Bills.query_bill(%{
      "order_by" => [desc: :inserted_at],
      "status" => :unpaid,
      "preload" => [:billing_period]
    })
  end
end
