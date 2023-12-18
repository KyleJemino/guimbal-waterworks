defmodule GuimbalWaterworksWeb.MemberLive.Print do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworksWeb.MemberLive.Helpers, as: MLHelpers
  alias GuimbalWaterworksWeb.MemberLive.Components, as: MemberComponents

  def mount(_params, _session, socket) do
    {:ok, socket, layout: {GuimbalWaterworksWeb.LayoutView, "print_app.html"}}
  end

  def handle_params(params, _uri, socket) do
    {:noreply,
     socket
     |> assign_filter_params(params)
     |> assign_members()
     |> assign_member_bill_map()}
  end

  defp assign_filter_params(socket, filter_params) do
    assign(
      socket,
      :filter_params,
      MLHelpers.sanitize_member_filters(filter_params)
    )
  end

  defp assign_members(socket) do
    list_params =
      socket.assigns.filter_params
      |> Map.merge(%{
        "preload" => [bills: MLHelpers.unpaid_bill_preload_query()],
        "order_by" => [
          asc: :last_name,
          asc: :first_name,
          asc: :middle_name,
          asc: :unique_identifier
        ]
      })
      |> Page.pagination_to_query_params()

    members =
      list_params
      |> Members.list_members()
      |> Enum.filter(&(Enum.count(&1.bills) > 0))

    assign(socket, :members, members)
  end

  defp assign_member_bill_map(%{assigns: %{members: members}} = socket) do
    member_bill_map = MLHelpers.build_member_bill_map(members)

    assign(socket, :member_bill_map, member_bill_map)
  end
end
