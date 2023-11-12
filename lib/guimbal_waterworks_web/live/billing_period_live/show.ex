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
     |> assign(:filter_params, params)
     |> assign(:clean_params, Map.drop(params, ["id"]))
     |> assign_return_to()}
  end

  defp page_title(:edit), do: "Edit Billing period"
  defp page_title(_), do: "Show Billing period"

  defp assign_return_to(socket) do
    params = socket.assigns.filter_params

    return_to =
      Routes.billing_period_show_path(
        socket,
        :show,
        Map.get(params, "id"),
        socket.assigns.clean_params
      )

    assign(socket, :return_to, return_to)
  end
end
