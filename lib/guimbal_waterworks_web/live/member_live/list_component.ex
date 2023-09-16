defmodule GuimbalWaterworksWeb.MemberLive.ListComponent do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Helpers

  @status_options [
    All: :all,
    Connected: :connected,
    Disconnected: :disconnected,
    "With Unpaid Bills": :with_unpaid,
    "With No Unpaid": :with_no_unpaid,
    "Disconnection Warning": :disconnection_warning,
    "For Disconnection": :for_disconnection,
    "For Reconnection": :for_reconnection
  ]

  @default_search_params %{
    "first_name" => "",
    "middle_name" => "",
    "last_name" => "",
    "unique_identifier" => "",
    "street" => "",
    "type" => "all",
    "actions?" => true
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
        Page.default_pagination_params()
      end

    base_params = %{
      "preload" => [bills: bill_preload_query()]
    }

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:status_options, @status_options)
     |> assign(:base_params, base_params)
     |> assign_search_params(search_params)
     |> assign_pagination_params(pagination_params)
     |> update_members_and_bills()}
  end

  @impl true
  def handle_event("filter_change", %{"search_params" => search_params}, socket) do
    actions? =
      search_params
      |> Map.get("actions?")
      |> String.to_existing_atom()

    format_params =
      search_params
      |> Map.replace!("actions?", actions?)

    {:noreply,
     socket
     |> assign_search_params(format_params)
     |> assign_pagination_params(%{
       "per_page" => socket.assigns.pagination_params["per_page"],
       "current_page" => 1
     })
     |> update_members_and_bills()}
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

    {:noreply,
     socket
     |> assign_pagination_params(formatted_pagination_params)
     |> update_members_and_bills()}
  end

  @impl true
  def handle_event("turn_page", %{"page" => page} = _params, socket) do
    updated_pagination_params =
      Map.replace!(socket.assigns.pagination_params, "current_page", String.to_integer(page))

    {:noreply,
     socket
     |> assign_pagination_params(updated_pagination_params)
     |> update_members_and_bills()}
  end

  defp assign_search_params(socket, search_params) do
    search_params_with_values = Helpers.remove_empty_map_values(search_params)

    assign(socket, :search_params, search_params_with_values)
  end

  defp assign_pagination_params(socket, pagination_params) do
    assign(socket, :pagination_params, pagination_params)
  end

  defp assign_members(
         %{
           assigns: %{
             base_params: base_params,
             search_params: search_params,
             pagination_params: pagination_params
           }
         } = socket
       ) do
    pagination_query_params = Page.pagination_to_query_params(pagination_params)

    list_params =
      base_params
      |> Map.merge(search_params)
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
              Bills.calculate_bill(bill, bill.billing_period, bill.member, bill.payment)

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

  defp assign_pagination_information(%{assigns: assigns} = socket) do
    result_member_count =
      assigns.base_params
      |> Map.merge(assigns.search_params)
      |> Members.count_members()

    display_count = Enum.count(assigns.members)

    pagination_info =
      Page.get_pagination_info(
        assigns.pagination_params,
        result_member_count,
        display_count
      )

    assign(socket, :pagination, pagination_info)
  end

  defp update_members_and_bills(socket) do
    socket
    |> assign_members()
    |> assign_member_bill_map()
    |> assign_pagination_information()
  end

  defp bill_preload_query do
    Bills.query_bill(%{
      "order_by" => [desc: :inserted_at],
      "status" => "unpaid",
      "preload" => [:billing_period, :member, :payment]
    })
  end
end
