defmodule GuimbalWaterworks.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias GuimbalWaterworks.Repo

  alias GuimbalWaterworks.Accounts.{Users, UsersToken, UsersNotifier}

  ## Database getters

  @doc """
  Gets a users by email.

  ## Examples

      iex> get_users_by_email("foo@example.com")
      %Users{}

      iex> get_users_by_email("unknown@example.com")
      nil

  """
  def get_users_by_email(email) when is_binary(email) do
    Repo.get_by(Users, email: email)
  end

  @doc """
  Gets a users by email and password.

  ## Examples

      iex> get_users_by_email_and_password("foo@example.com", "correct_password")
      %Users{}

      iex> get_users_by_email_and_password("foo@example.com", "invalid_password")
      nil

  """
  def get_users_by_email_and_password(email, password)
      when is_binary(email) and is_binary(password) do
    users = Repo.get_by(Users, email: email)
    if Users.valid_password?(users, password), do: users
  end

  @doc """
  Gets a single users.

  Raises `Ecto.NoResultsError` if the Users does not exist.

  ## Examples

      iex> get_users!(123)
      %Users{}

      iex> get_users!(456)
      ** (Ecto.NoResultsError)

  """
  def get_users!(id), do: Repo.get!(Users, id)

  ## Users registration

  @doc """
  Registers a users.

  ## Examples

      iex> register_users(%{field: value})
      {:ok, %Users{}}

      iex> register_users(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def register_users(attrs) do
    %Users{}
    |> Users.registration_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking users changes.

  ## Examples

      iex> change_users_registration(users)
      %Ecto.Changeset{data: %Users{}}

  """
  def change_users_registration(%Users{} = users, attrs \\ %{}) do
    Users.registration_changeset(users, attrs, hash_password: false)
  end

  ## Settings

  @doc """
  Returns an `%Ecto.Changeset{}` for changing the users email.

  ## Examples

      iex> change_users_email(users)
      %Ecto.Changeset{data: %Users{}}

  """
  def change_users_email(users, attrs \\ %{}) do
    Users.email_changeset(users, attrs)
  end

  @doc """
  Emulates that the email will change without actually changing
  it in the database.

  ## Examples

      iex> apply_users_email(users, "valid password", %{email: ...})
      {:ok, %Users{}}

      iex> apply_users_email(users, "invalid password", %{email: ...})
      {:error, %Ecto.Changeset{}}

  """
  def apply_users_email(users, password, attrs) do
    users
    |> Users.email_changeset(attrs)
    |> Users.validate_current_password(password)
    |> Ecto.Changeset.apply_action(:update)
  end

  @doc """
  Updates the users email using the given token.

  If the token matches, the users email is updated and the token is deleted.
  The confirmed_at date is also updated to the current time.
  """
  def update_users_email(users, token) do
    context = "change:#{users.email}"

    with {:ok, query} <- UsersToken.verify_change_email_token_query(token, context),
         %UsersToken{sent_to: email} <- Repo.one(query),
         {:ok, _} <- Repo.transaction(users_email_multi(users, email, context)) do
      :ok
    else
      _ -> :error
    end
  end

  defp users_email_multi(users, email, context) do
    changeset =
      users
      |> Users.email_changeset(%{email: email})
      |> Users.confirm_changeset()

    Ecto.Multi.new()
    |> Ecto.Multi.update(:users, changeset)
    |> Ecto.Multi.delete_all(:tokens, UsersToken.users_and_contexts_query(users, [context]))
  end

  @doc """
  Delivers the update email instructions to the given users.

  ## Examples

      iex> deliver_update_email_instructions(users, current_email, &Routes.users_update_email_url(conn, :edit, &1))
      {:ok, %{to: ..., body: ...}}

  """
  def deliver_update_email_instructions(%Users{} = users, current_email, update_email_url_fun)
      when is_function(update_email_url_fun, 1) do
    {encoded_token, users_token} = UsersToken.build_email_token(users, "change:#{current_email}")

    Repo.insert!(users_token)
    UsersNotifier.deliver_update_email_instructions(users, update_email_url_fun.(encoded_token))
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for changing the users password.

  ## Examples

      iex> change_users_password(users)
      %Ecto.Changeset{data: %Users{}}

  """
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

  ## Confirmation

  @doc """
  Delivers the confirmation email instructions to the given users.

  ## Examples

      iex> deliver_users_confirmation_instructions(users, &Routes.users_confirmation_url(conn, :edit, &1))
      {:ok, %{to: ..., body: ...}}

      iex> deliver_users_confirmation_instructions(confirmed_users, &Routes.users_confirmation_url(conn, :edit, &1))
      {:error, :already_confirmed}

  """
  def deliver_users_confirmation_instructions(%Users{} = users, confirmation_url_fun)
      when is_function(confirmation_url_fun, 1) do
    if users.confirmed_at do
      {:error, :already_confirmed}
    else
      {encoded_token, users_token} = UsersToken.build_email_token(users, "confirm")
      Repo.insert!(users_token)
      UsersNotifier.deliver_confirmation_instructions(users, confirmation_url_fun.(encoded_token))
    end
  end

  @doc """
  Confirms a users by the given token.

  If the token matches, the users account is marked as confirmed
  and the token is deleted.
  """
  def confirm_users(token) do
    with {:ok, query} <- UsersToken.verify_email_token_query(token, "confirm"),
         %Users{} = users <- Repo.one(query),
         {:ok, %{users: users}} <- Repo.transaction(confirm_users_multi(users)) do
      {:ok, users}
    else
      _ -> :error
    end
  end

  defp confirm_users_multi(users) do
    Ecto.Multi.new()
    |> Ecto.Multi.update(:users, Users.confirm_changeset(users))
    |> Ecto.Multi.delete_all(:tokens, UsersToken.users_and_contexts_query(users, ["confirm"]))
  end

  ## Reset password

  @doc """
  Delivers the reset password email to the given users.

  ## Examples

      iex> deliver_users_reset_password_instructions(users, &Routes.users_reset_password_url(conn, :edit, &1))
      {:ok, %{to: ..., body: ...}}

  """
  def deliver_users_reset_password_instructions(%Users{} = users, reset_password_url_fun)
      when is_function(reset_password_url_fun, 1) do
    {encoded_token, users_token} = UsersToken.build_email_token(users, "reset_password")
    Repo.insert!(users_token)
    UsersNotifier.deliver_reset_password_instructions(users, reset_password_url_fun.(encoded_token))
  end

  @doc """
  Gets the users by reset password token.

  ## Examples

      iex> get_users_by_reset_password_token("validtoken")
      %Users{}

      iex> get_users_by_reset_password_token("invalidtoken")
      nil

  """
  def get_users_by_reset_password_token(token) do
    with {:ok, query} <- UsersToken.verify_email_token_query(token, "reset_password"),
         %Users{} = users <- Repo.one(query) do
      users
    else
      _ -> nil
    end
  end

  @doc """
  Resets the users password.

  ## Examples

      iex> reset_users_password(users, %{password: "new long password", password_confirmation: "new long password"})
      {:ok, %Users{}}

      iex> reset_users_password(users, %{password: "valid", password_confirmation: "not the same"})
      {:error, %Ecto.Changeset{}}

  """
  def reset_users_password(users, attrs) do
    Ecto.Multi.new()
    |> Ecto.Multi.update(:users, Users.password_changeset(users, attrs))
    |> Ecto.Multi.delete_all(:tokens, UsersToken.users_and_contexts_query(users, :all))
    |> Repo.transaction()
    |> case do
      {:ok, %{users: users}} -> {:ok, users}
      {:error, :users, changeset, _} -> {:error, changeset}
    end
  end
end
