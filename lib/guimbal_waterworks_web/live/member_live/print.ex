defmodule GuimbalWaterworksWeb.MemberLive.Print do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworksWeb.MemberLive.Helpers, as: MLHelpers

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(params, _uri, socket) do
    {:noreply, socket}
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

    members = Members.list_members(list_params)

    assign(socket, :members, members)
  end
end
