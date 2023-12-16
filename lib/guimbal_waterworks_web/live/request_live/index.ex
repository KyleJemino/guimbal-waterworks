defmodule GuimbalWaterworksWeb.RequestLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Requests
  # alias GuimbalWaterworks.Requests.Request

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(_params, _url, socket) do
    {:noreply,
      socket
      |> assign_requests()
    }
  end

  def handle_event("approve", %{"request_id" => request_id}, socket) do
    IO.inspect request_id
    {:noreply, socket}
  end

  def handle_event("reject", params, socket) do
    IO.inspect params
    {:noreply, socket}
  end

  defp assign_requests(socket) do
    assign(socket, :requests, Requests.list_requests(%{
      "active?" => true,
      "order_by" => "latest",
      "preload" => [:user]
    }))
  end
end
