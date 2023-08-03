defmodule GuimbalWaterworksWeb.AssignUsers do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Accounts

  def on_mount(:default, _params, %{"users_token" => user_token}, socket) do
    socket =
      assign_new(socket, :current_users, fn ->
        Accounts.get_users_by_session_token(user_token)
      end)

    if socket.assigns.current_users do
      {:cont, socket}
    else
      {:halt, redirect(socket, to: Routes.users_session_path(socket, :new))}
    end
  end
end
