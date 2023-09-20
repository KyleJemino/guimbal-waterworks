defmodule GuimbalWaterworksWeb.BillLive.Print do
  use GuimbalWaterworksWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply,
     socket
     |> assign(:page_title, Atom.to_string(socket.assigns.live_action))}
  end
end
