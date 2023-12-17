defmodule GuimbalWaterworks.Requests.Resolvers.RequestResolver do
  import Ecto.Changeset

  alias Ecto.Multi
  alias GuimbalWaterworks.Repo
  alias GuimbalWaterworks.Requests.Request
  alias GuimbalWaterworks.Token
  alias GuimbalWaterworks.Accounts
  alias GuimbalWaterworks.Helpers
  alias Accounts.Users
  alias GuimbalWaterworks.Requests.Queries.RequestQuery, as: RQ

  @types ["password_change"]

  def list_requests(params \\ %{}) do
    params
    |> RQ.query_request()
    |> Repo.all()
  end

  def get_request(params \\ %{}) do
    params
    |> RQ.query_request()
    |> Repo.one()
  end

  def get_request!(params \\ %{}) do
    params
    |> RQ.query_request()
    |> Repo.one!()
  end

  def create_request(params) do
    Multi.new()
    |> Multi.run(:user, fn _repo, _ops ->
      case Accounts.get_users_by_username(params["username"]) do
        %Users{} = user ->
          {:ok, user}

        _ ->
          {:error,
           %Request{}
           |> password_request_changeset(params)
           |> add_error(:username, "User doesn't exist")
           |> Map.put(:action, :validate)}
      end
    end)
    |> Multi.insert(:create, fn %{user: user} ->
      params_with_user =
        params
        |> Map.put("user_id", user.id)

      password_request_changeset(%Request{}, params_with_user)
    end)
    |> Repo.transaction()
  end

  def password_request_changeset(request, attrs) do
    request
    |> cast(attrs, [
      :username,
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

  def approve_request(%Request{type: "password_change"} = request) do
    request
    |> password_change_multi()
    |> Repo.transaction()
    |> case do
      {:ok, %{approved_request: request}} ->
        {:ok, request}

      {:error, _op, _val, _changes} = result ->
        IO.inspect(result)
        {:error, :failed_multi}
    end
  end

  def archive_request(request) do
    request
    |> archive_changeset()
    |> Repo.update()
    |> case do
      {:ok, %Request{} = request} -> {:ok, request}
      {:error, changeset} -> {:error, changeset}
    end
  end

  def used_changeset(request) do
    change(request, used_at: Helpers.db_now())
  end

  def archive_changeset(request) do
    change(request, archived_at: Helpers.db_now())
  end

  defp password_change_multi(
         %{
           user_id: user_id,
           token: token
         } = request
       ) do
    Multi.new()
    |> Multi.run(:user, fn _repo, _multi ->
      {:ok, Accounts.get_users!(user_id)}
    end)
    |> Multi.run(:password_attrs, fn _repo, _multi ->
      {:ok, %{"password" => new_password}} = Joken.peek_claims(token)

      {:ok,
       %{
         "password" => new_password,
         "password_confirmation" => new_password
       }}
    end)
    |> Multi.update(
      :updated_user,
      fn %{
           user: user,
           password_attrs: password_attrs
         } ->
        Users.password_changeset(user, password_attrs)
      end
    )
    |> Multi.update(:approved_request, fn _multi ->
      used_changeset(request)
    end)
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

  defp maybe_add_token(changeset) when not changeset.valid?, do: changeset

  defp build_jwt(changeset) do
    token_content =
      case fetch_field!(changeset, :type) do
        "password_change" ->
          %{
            password: fetch_field!(changeset, :password)
          }

        _ ->
          nil
      end

    {:ok, token, _claims} = Token.generate_and_sign(token_content)

    token
  end

  defp validate_password(changeset) do
    changeset
    |> validate_required([:password, :password_confirmation])
    |> validate_length(:password, min: 8, max: 72)
    |> validate_confirmation(:password, message: "does not match password")
    |> delete_change(:password_confirmation)
  end
end
