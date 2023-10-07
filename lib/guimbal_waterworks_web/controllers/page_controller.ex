defmodule GuimbalWaterworksWeb.PageController do
  use GuimbalWaterworksWeb, :controller

  def index(conn, _params) do
    if conn.assigns[:current_users] do
      conn
      |> redirect(to: Routes.member_index_path(conn, :index))
      |> halt()
    else
      conn
      |> redirect(to: Routes.users_session_path(conn, :new))
      |> halt()
    end
  end
end
