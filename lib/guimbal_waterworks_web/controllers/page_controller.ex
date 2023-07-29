defmodule GuimbalWaterworksWeb.PageController do
  use GuimbalWaterworksWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
