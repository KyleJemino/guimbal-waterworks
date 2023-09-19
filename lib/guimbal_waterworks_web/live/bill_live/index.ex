defmodule GuimbalWaterworksWeb.BillLive.Index do
  use GuimbalWaterworksWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    IO.inspect params
    {:noreply,
     socket
     |> assign(:page_title, "Bills")}
  end
end
