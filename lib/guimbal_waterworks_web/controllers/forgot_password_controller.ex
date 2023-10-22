defmodule GuimbalWaterworksWeb.ForgotPasswordController do
  use GuimbalWaterworksWeb, :controller

  def new(conn, _params) do
    render(conn, "new.html")
  end
end
