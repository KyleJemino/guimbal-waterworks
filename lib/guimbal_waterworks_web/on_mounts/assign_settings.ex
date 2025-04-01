defmodule GuimbalWaterworksWeb.OnMounts.AssignSettings do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Settings

  def on_mount(:default, _params, _session, socket) do
    socket =
      assign_new(socket, :settings, fn ->
        Settings.get_settings()
      end)

    {:cont, socket}
  end
end
