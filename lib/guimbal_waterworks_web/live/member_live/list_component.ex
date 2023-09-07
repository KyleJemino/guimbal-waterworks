defmodule GuimbalWaterworksWeb.MemberLive.ListComponent do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Bills

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
    search_params_with_values =
      search_params
      |> Enum.filter(fn {_key, value} ->
        not is_nil(value) and value !== ""
      end)
      |> Map.new()

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
             pagination_params: %{
               "per_page" => limit,
               "current_page" => current_page
             }
           }
         } = socket
       ) do
    pagination_query_params =
      if limit != "All" do
        %{
          "limit" => limit,
          "offset" => limit * (current_page - 1)
        }
      else
        %{}
      end

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

  defp assign_pagination_information(%{assigns: assigns} = socket) do
    %{
      "per_page" => per_page,
      "current_page" => current_page
    } = assigns.pagination_params

    result_member_count =
      assigns.base_params
      |> Map.merge(assigns.search_params)
      |> Members.count_members()

    pages_count =
      if per_page != "All" do
        ceil(result_member_count / per_page)
      else
        1
      end

    display_count = Enum.count(assigns.members)

    pagination_chunks =
      cond do
        per_page == "All" ->
          []

        pages_count < 10 ->
          [
            Enum.to_list(1..pages_count)
          ]

        current_page < 7 ->
          [
            Enum.to_list(1..10),
            [pages_count - 1, pages_count]
          ]

        current_page > pages_count - 6 ->
          [
            [1, 2],
            Enum.to_list((pages_count - 9)..pages_count)
          ]

        true ->
          [
            [1],
            Enum.to_list((current_page - 4)..(current_page + 4)),
            [pages_count]
          ]
      end

    assign(socket, :pagination, %{
      total_count: result_member_count,
      display_count: display_count,
      pages_count: pages_count,
      pagination_chunks: pagination_chunks
    })
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
      "status" => :unpaid,
      "preload" => [:billing_period]
    })
  end
end
