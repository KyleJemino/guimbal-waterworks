defmodule GuimbalWaterworksWeb.BillingPeriodLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.BillingPeriod

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, :billing_periods, list_billing_periods())}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit Billing period")
    |> assign(:billing_period, Bills.get_billing_period!(id))
  end

  defp apply_action(socket, :new, _params) do
    year_string = 
      Date.utc_today().year
      |> Integer.to_string()

    billing_period_with_defaults =
      %BillingPeriod{
        personal_rate: 0.02,
        business_rate: 0.02,
        year: year_string
      }
    socket
    |> assign(:page_title, "New Billing period")
    |> assign(
      :billing_period, 
      billing_period_with_defaults
    )
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Listing Billing periods")
    |> assign(:billing_period, nil)
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    billing_period = Bills.get_billing_period!(id)
    {:ok, _} = Bills.delete_billing_period(billing_period)

    {:noreply, assign(socket, :billing_periods, list_billing_periods())}
  end

  defp list_billing_periods do
    Bills.list_billing_periods()
  end
end
