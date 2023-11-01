defmodule GuimbalWaterworksWeb.RateLive.Show do
  use GuimbalWaterworksWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => rate_id}, _url, socket) do
    IO.inspect rate_id
    {:noreply, socket}
  end
end
