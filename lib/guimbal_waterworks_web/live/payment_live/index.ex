defmodule GuimbalWaterworksWeb.PaymentLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Helpers

  @impl true
  def mount(params, _session, socket) do
    default_params = add_defaults_to_params(params)
    {:ok, 
      assign(socket, :default_params, default_params)
    }
  end

  def handle_params(params, _uri, socket) do
    default_params = socket.assigns.default_params
    params_to_use =
      if not is_nil(default_params) do
        default_params
      else
        params
      end

    {:noreply, 
      assign(socket, :filter_params, params_to_use)} 
  end

  defp add_defaults_to_params(params) do
    Map.put_new(params, "paid_from", Helpers.today_datetime())
  end
end
