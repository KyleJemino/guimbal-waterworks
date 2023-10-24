defmodule GuimbalWaterworksWeb.RequestLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Requests
  alias GuimbalWaterworks.Requests.Request

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(params, _url, socket) do
    {:noreply,
      socket
      |> assign_requests()
    }
  end

  defp assign_requests(socket) do
    assign(socket, :requests, [])
  end
end
