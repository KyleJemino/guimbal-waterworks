defmodule GuimbalWaterworksWeb.MemberLive.Show do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Members

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign_new(socket, :show_info?, fn -> true end)}
  end

  @impl true
  def handle_params(%{"id" => id}, _, socket) do
    {:noreply,
     socket
     |> assign(:page_title, page_title(socket.assigns.live_action))
     |> assign(:member, Members.get_member!(id))}
  end

  def handle_event("show_info", _value, socket) do
    {:noreply, assign(socket, :show_info?, true)}
  end

  def handle_event("hide_info", _value, socket) do
    {:noreply, assign(socket, :show_info?, false)}
  end

  defp page_title(:show), do: "Show Member"
  defp page_title(:edit), do: "Edit Member"
end
