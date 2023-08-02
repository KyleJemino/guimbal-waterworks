defmodule GuimbalWaterworksWeb.EmployeeLive.Index do
  use GuimbalWaterworksWeb, :live_view 

  alias GuimbalWaterworks.Accounts.Users

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(_params, _url, socket) do
    {:noreply, socket}
  end
end
