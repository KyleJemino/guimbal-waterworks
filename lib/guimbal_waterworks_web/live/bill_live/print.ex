defmodule GuimbalWaterworksWeb.BillLive.Print do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Bills

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    action = socket.assigns.live_action

    {:noreply,
     socket
     |> assign(:page_title, Atom.to_string(action))}
     |> assign_bills(params, action)
  end

  defp assign_bills(
    socket, 
    %{"billling_period_id" => _billing_period_id} = params, 
    :index
  ) do

    final_params
    |> Map.merge({
      "status" => :unpaid
    })
    |> 

  end
end
