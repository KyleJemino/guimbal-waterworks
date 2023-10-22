defmodule GuimbalWaterworks.Requests.Resolvers.RequestResolver do
  import Ecto.Changeset

  alias GuimbalWaterworks.Requests.Request

  def request_password_changeset(request, params) do
    request
    |> cast(attrs, [
      :type,
      :username,
      :password,
      :password_confirmation
    ])
    |> validate_required([:type, :username])
  end
end
