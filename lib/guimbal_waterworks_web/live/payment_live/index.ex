defmodule GuimbalWaterworksWeb.PaymentLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Helpers

  @impl true
  def mount(params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(params, _uri, socket) do
    {:noreply, assign(socket, :filter_params, params)}
  end
end
