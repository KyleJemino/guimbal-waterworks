defmodule GuimbalWaterworksWeb.Plugs.Settings do
  import Plug.Conn
  import Phoenix.Controller

  alias GuimbalWaterworks.Settings
  alias GuimbalWaterworks.Settings.Setting

  def fetch_settings(conn, _opts) do
    case Settings.get_settings() do
      %Setting{} = settings ->
        assign(conn, :settings, settings)

      _ ->
        assign(conn, :settings, %Setting{})
    end
  end
end
