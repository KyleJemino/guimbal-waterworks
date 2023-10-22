defmodule GuimbalWaterworks.Requests.Resolvers.RequestResolver do
  import Ecto.Changeset

  alias GuimbalWaterworks.Requests.Request
  alias JsonWebToken, as: JWT

  @types ["password_change"]
  @token_secret Application.get_env(:guimbal_waterworks, :config)[:jwt_secret]

  def request_password_changeset(request, attrs) do
    request
    |> cast(attrs, [
      :type,
      :user_id,
      :password,
      :password_confirmation
    ])
    |> validate_required([:type, :user_id])
    |> validate_inclusion(:type, @types)
    |> foreign_key_constraint(:user_id)
    |> validate_password()
    |> maybe_add_token()
  end

  defp maybe_add_token(changeset) when changeset.valid? do
    case fetch_field!(changeset, :type) do
      "password_change" ->
        changeset
        |> put_change(:token, build_jwt(changeset))
        |> delete_change(:password)
      _ -> 
        changeset
    end
  end

  defp maybe_add_token(changeset) when not(changeset.valid?), do: changeset

  defp build_jwt(changeset) do
    token_content =
      case fetch_field!(changeset, :type) do
        "password_change" -> Jason.encode!(%{
          password: fetch_field!(changeset, :password)
        })
        _ -> nil
      end

    token = JWT.sign(token_content, %{key: @token_secret})
  end

  defp validate_password(changeset) do
    changeset
    |> validate_required([:password, :password_confirmation])
    |> validate_length(:password, min: 8, max: 72)
    |> validate_confirmation(:password, message: "does not match password")
    |> delete_change(:password_confirmation)
  end
end
