defmodule GuimbalWaterworksWeb.MemberLive.ListComponent do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworksWeb.MemberLive.Helpers, as: MLHelpers

  @status_options [
    All: :all,
    Connected: :connected,
    Disconnected: :disconnected,
    "With Unpaid Bills": :with_unpaid,
    "Updated Payments": :updated_payments,
    "For Disconnection": :for_disconnection,
    "For Reconnection": :for_reconnection
  ]

  @valid_filter_keys [
    "last_name",
    "first_name",
    "middle_name",
    "street",
    "type",
    "due_from",
    "due_to",
    "status",
    "archived?"
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
    {:noreply, assign_search_params(socket, search_params)}
  end

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
      Map.replace!(socket.assigns.pagination_params, "current_page", String.to_integer(page))

    {:noreply,
     socket
     |> assign_pagination_params(updated_pagination_params)
     |> patch_params_path()}
  end

  @impl true
  def handle_event("archive", %{"id" => id}, socket) do
    member = Members.get_member!(id)

    params = %{
      "archived_by" => socket.assigns.current_users.id
    }

    case Members.archive_member(member, params) do
      {:ok, _member} ->
        {:noreply,
         socket
         |> put_flash(:info, "User deleted")
         |> patch_params_path(redirect?: true)}

      _ ->
        {:noreply, put_flash(socket, :error, "Something went wrong")}
    end
  end

  @impl true
  def handle_event("unarchive", %{"id" => id}, socket) do
    member = Members.get_member!(id)

    case Members.unarchive_member(member) do
      {:ok, _member} ->
        {:noreply,
         socket
         |> put_flash(:info, "User restored")
         |> patch_params_path(redirect?: true)}

      {:error, changeset} ->
        IO.inspect(changeset, label: "### error", level: :infinity)
        {:noreply, put_flash(socket, :error, "Something went wrong")}
    end
  end

  defp assign_filter_params(socket, filter_params) do
    assign(
      socket,
      :filter_params,
      MLHelpers.sanitize_member_filters(filter_params)
    )
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
        "preload" => [:archiver, bills: MLHelpers.unpaid_bill_preload_query()],
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
    member_bill_map = MLHelpers.build_member_bill_map(members)

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

  defp assign_total_unpaid(socket) do
    total_unpaid =
      Enum.reduce(
        socket.assigns.member_bill_map,
        0,
        fn entry, acc ->
          {_key, bill_map} = entry
          Decimal.add(bill_map.total, acc)
        end
      )

    assign(socket, :total_unpaid, total_unpaid)
  end

  defp update_members_and_bills(socket) do
    socket
    |> assign_members()
    |> assign_member_bill_map()
    |> assign_total_unpaid()
    |> assign_pagination_information()
  end

  defp patch_params_path(socket, opts \\ []) do
    redirect? = Keyword.get(opts, :redirect?, false)

    %{
      assigns: %{
        search_params: search_params,
        pagination_params: pagination_params
      }
    } = socket

    updated_filter_params =
      search_params
      |> Map.merge(pagination_params)
      |> MLHelpers.sanitize_member_filters()

    route = Routes.member_index_path(socket, :index, updated_filter_params)

    if redirect? do
      push_redirect(socket, to: route)
    else
      push_patch(socket, to: route)
    end
  end
end
