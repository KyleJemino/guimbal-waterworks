defmodule GuimbalWaterworksWeb.RateLive.Index do
  use GuimbalWaterworksWeb, :live_view
  alias GuimbalWaterworks.Bills

  @impl true
  def mount(_params, _session, socket) do
    rates = Bills.list_rates(%{"order_by" => "default"})
    {:ok, assign(socket, :rates, rates)}
  end

  @impl true
  def handle_params(_params, _url, socket) do
    {:noreply, socket}
  end
end
