defmodule GuimbalWaterworksWeb.MemberLive.SelectForm do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Helpers

  @default_search_params %{
    "first_name" => "",
    "middle_name" => "",
    "last_name" => "",
    "unique_identifier" => ""
  }

  @impl true
  def update(assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(:search_params, @default_search_params)
     |> assign(:members, [])}
  end

  def handle_event("search", %{"search" => search_params}, socket) do
    {:noreply,
     socket
     |> assign(:search_params, search_params)
     |> assign_members()}
  end

  def handle_event("select", %{"member-id" => member_id}, socket) do
    event_name = socket.assigns.event_name
    send(self(), {event_name, member_id})
    {:noreply, socket}
  end

  defp assign_members(socket) do
    query_params =
      socket.assigns.search_params
      |> Map.put("limit", 5)
      |> Helpers.remove_empty_map_values()

    members = Members.list_members(query_params)

    assign(socket, :members, members)
  end
end
