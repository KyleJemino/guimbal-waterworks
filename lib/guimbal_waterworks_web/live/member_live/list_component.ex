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

  @impl true
  def update(assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(:status_options, @status_options)
     |> assign_filter_params(assigns.filter_params)
     |> assign_search_params()
     |> assign_pagination_params()
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

    {:noreply, assign_search_params(socket, format_params)}
  end

  def handle_event("filter_submit", %{"search_params" => search_params}, socket) do
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
      Map.replace!(socket.assigns.pagination_params, "current_page", String.to_integer(page))

    {:noreply,
     socket
     |> assign_pagination_params(updated_pagination_params)
     |> patch_params_path()}
  end

  defp assign_filter_params(socket, filter_params) do
    sanitized_params =
      filter_params
      |> Helpers.remove_empty_map_values()
      |> Map.take(Page.param_keys() ++ @valid_filter_keys)
      |> Map.merge(Page.default_pagination_params(), fn _k, v1, _v2 -> v1 end)
      |> Page.sanitize_pagination_params()

    assign(socket, :filter_params, sanitized_params)
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
      |> Map.take(Page.param_keys())
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

  defp assign_members(
         %{
           assigns: %{
             filter_params: filter_params
           }
         } = socket
       ) do
    list_params =
      filter_params
      |> Map.merge(%{
        "preload" => [bills: bill_preload_query()],
        "order_by" => [
          asc: :last_name,
          asc: :first_name,
          asc: :middle_name,
          asc: :unique_identifier
        ]
      })
      |> Page.pagination_to_query_params()

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
    result_member_count = Members.count_members(assigns.filter_params)

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

  defp patch_params_path(socket) do
    %{
      assigns: %{
        search_params: search_params,
        pagination_params: pagination_params
      }
    } = socket

    updated_filter_params =
      search_params
      |> Map.merge(pagination_params)

    route = Routes.member_index_path(socket, :index, updated_filter_params)

    push_patch(socket, to: route)
  end
end
