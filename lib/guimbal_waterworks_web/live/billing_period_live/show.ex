defmodule GuimbalWaterworksWeb.BillingPeriodLive.Show do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Bills

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id} = params, _, socket) do
    {:noreply,
     socket
     |> assign(:page_title, page_title(socket.assigns.live_action))
     |> assign(:billing_period, Bills.get_billing_period!(id))
     |> assign(:filter_params, params)}
  end

  defp page_title(:edit), do: "Edit Billing period"
  defp page_title(_), do: "Show Billing period"
end
