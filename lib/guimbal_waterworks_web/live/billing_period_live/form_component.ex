defmodule GuimbalWaterworksWeb.BillingPeriodLive.FormComponent do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Bills

  @impl true
  def update(%{billing_period: billing_period} = assigns, socket) do
    changeset = Bills.change_billing_period(billing_period)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:changeset, changeset)}
  end

  @impl true
  def handle_event("validate", %{"billing_period" => billing_period_params}, socket) do
    changeset =
      socket.assigns.billing_period
      |> Bills.change_billing_period(billing_period_params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :changeset, changeset)}
  end

  def handle_event("save", %{"billing_period" => billing_period_params}, socket) do
    save_billing_period(socket, socket.assigns.action, billing_period_params)
  end

  defp save_billing_period(socket, :edit, billing_period_params) do
    case Bills.update_billing_period(socket.assigns.billing_period, billing_period_params) do
      {:ok, _billing_period} ->
        {:noreply,
         socket
         |> put_flash(:info, "Billing period updated successfully")
         |> push_redirect(to: socket.assigns.return_to)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, :changeset, changeset)}
    end
  end

  defp save_billing_period(socket, :new, billing_period_params) do
    case Bills.create_billing_period(billing_period_params) do
      {:ok, _billing_period} ->
        {:noreply,
         socket
         |> put_flash(:info, "Billing period created successfully")
         |> push_redirect(to: socket.assigns.return_to)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end
end
