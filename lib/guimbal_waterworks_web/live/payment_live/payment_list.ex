defmodule GuimbalWaterworksWeb.PaymentLive.PaymentList do
  use GuimbalWaterworksWeb, :live_component

  def update(assigns, socket) do
    {:ok,
      socket
      |> assign(assigns)
      |> assign(:base_params, assigns.base_params || %{})
      |> update_results
    }
  end

  defp update_results(socket) do
    socket
  end
end
