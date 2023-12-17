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
     |> assign_requests()}
  end

  def handle_event("approve", %{"request_id" => request_id}, socket) do
    with request <- Requests.get_request(%{"id" => request_id}),
         {:ok, _request} <- Requests.approve_request(request),
         do: :ok

    {:noreply, assign_requests(socket)}
  end

  def handle_event("reject", %{"request_id" => request_id}, socket) do
    with request <- Requests.get_request(%{"id" => request_id}),
         {:ok, _request} <- Requests.archive_request(request),
         do: :ok

    {:noreply, assign_requests(socket)}
  end

  defp assign_requests(socket) do
    assign(
      socket,
      :requests,
      Requests.list_requests(%{
        "active?" => true,
        "order_by" => "latest",
        "preload" => [:user]
      })
    )
  end
end
