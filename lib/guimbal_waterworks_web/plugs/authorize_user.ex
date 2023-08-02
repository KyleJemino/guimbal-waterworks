defmodule GuimbalWaterworksWeb.Plugs.AuthorizeUser do
  import Plug.Conn
  import Phoenix.Controller

  alias GuimbalWaterworks.Accounts.Users

  def init(opts), do: opts

  def call(conn, opts) when is_list(opts) do
    allowed_roles = Enum.uniq([:manager | opts])

    %Users{role: role} = conn.assigns[:current_users]

    if role in allowed_roles do
      conn
    else
      conn
      |> put_flash(:error, "You are not authorized to access the page.")
      |> redirect(to: not_authorized_path(conn))
      |> halt()
    end
  end

  defp not_authorized_path(conn) do
    case conn do
      %Users{role: :admin} -> "/"
      %Users{role: :cashier} -> "/"
      _user -> "/"
    end
  end
end
