defmodule GuimbalWaterworks.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias GuimbalWaterworks.Repo

  alias GuimbalWaterworks.Accounts.{Users, UsersToken, UsersNotifier}
  alias GuimbalWaterworks.Accounts.Queries.UserQuery

  ## Database getters

  def get_users_by_username(username) when is_binary(username) do
    Repo.get_by(Users, username: username)
  end

  def get_users_by_username_and_password(username, password)
      when is_binary(username) and is_binary(password) do
    users = Repo.get_by(Users, username: username)
    if Users.valid_password?(users, password), do: users
  end

  def get_users!(id), do: Repo.get!(Users, id)

  def register_users(attrs) do
    %Users{}
    |> Users.registration_changeset(attrs)
    |> Repo.insert()
  end

  def change_users_registration(%Users{} = users, attrs \\ %{}) do
    Users.registration_changeset(users, attrs, hash_password: false)
  end

  ## Settings
  def change_users_password(users, attrs \\ %{}) do
    Users.password_changeset(users, attrs, hash_password: false)
  end

  @doc """
  Updates the users password.

  ## Examples

      iex> update_users_password(users, "valid password", %{password: ...})
      {:ok, %Users{}}

      iex> update_users_password(users, "invalid password", %{password: ...})
      {:error, %Ecto.Changeset{}}

  """
  def update_users_password(users, password, attrs) do
    changeset =
      users
      |> Users.password_changeset(attrs)
      |> Users.validate_current_password(password)

    Ecto.Multi.new()
    |> Ecto.Multi.update(:users, changeset)
    |> Ecto.Multi.delete_all(:tokens, UsersToken.users_and_contexts_query(users, :all))
    |> Repo.transaction()
    |> case do
      {:ok, %{users: users}} -> {:ok, users}
      {:error, :users, changeset, _} -> {:error, changeset}
    end
  end

  ## Session

  @doc """
  Generates a session token.
  """
  def generate_users_session_token(users) do
    {token, users_token} = UsersToken.build_session_token(users)
    Repo.insert!(users_token)
    token
  end

  @doc """
  Gets the users with the given signed token.
  """
  def get_users_by_session_token(token) do
    {:ok, query} = UsersToken.verify_session_token_query(token)
    Repo.one(query)
  end

  @doc """
  Deletes the signed token with the given context.
  """
  def delete_session_token(token) do
    Repo.delete_all(UsersToken.token_and_context_query(token, "session"))
    :ok
  end

  def approve_user(user) do
    user
    |> Users.approve_changeset()
    |> Repo.update() 
  end

  def list_users(params \\ %{}) do
    params 
    |> UserQuery.query_user()
    |> Repo.all()
  end
end
