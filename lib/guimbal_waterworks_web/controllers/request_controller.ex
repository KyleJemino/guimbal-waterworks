defmodule GuimbalWaterworksWeb.RequestController do
  use GuimbalWaterworksWeb, :controller

  alias GuimbalWaterworks.Requests
  alias GuimbalWaterworks.Requests.Request

  def forgot_password(conn, _params) do
    render(conn, "forgot_password.html",
      changeset: Requests.password_request_changeset(%Request{}, %{})
    )
  end

  def forgot_password_token(conn, %{"request" => request_params}) do
    IO.inspect request_params

    render(conn, "forgot_password.html",
      changeset: Requests.password_request_changeset(%Request{}, %{})
    )
  end
end
