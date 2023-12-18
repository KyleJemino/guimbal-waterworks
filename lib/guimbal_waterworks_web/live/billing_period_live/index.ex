defmodule GuimbalWaterworksWeb.BillingPeriodLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Bills

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
    socket
    |> assign(:page_title, "New Billing period")
    |> assign(
      :billing_period,
      Bills.new_billing_period()
    )
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Listing Billing periods")
    |> assign(:billing_period, nil)
  end

  defp list_billing_periods do
    rate_query =
      Bills.query_rate(%{
        "select" => [:title, :id]
      })

    Bills.list_billing_periods(%{
      "preload" => [rate: rate_query],
      "order_by" => [desc: :due_date]
    })
  end
end
