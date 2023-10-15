defmodule GuimbalWaterworks.Accounts.Users do
  use Ecto.Schema
  import Ecto.Changeset

  alias GuimbalWaterworks.Helpers
  alias GuimbalWaterworks.Bills.Bill

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "users" do
    field :username, :string
    field :first_name, :string
    field :middle_name, :string
    field :last_name, :string
    field :role, Ecto.Enum, values: [:manager, :admin, :cashier]
    field :password, :string, virtual: true, redact: true
    field :password_confirmation, :string, virtual: true, redact: true
    field :hashed_password, :string, redact: true
    field :approved_at, :utc_datetime
    field :archived_at, :utc_datetime

    has_many :bills, Bill

    timestamps()
  end

  @doc """
  A users changeset for registration.

  It is important to validate the length of both email and password.
  Otherwise databases may truncate the email without warnings, which
  could lead to unpredictable or insecure behaviour. Long passwords may
  also be very expensive to hash for certain algorithms.

  ## Options

    * `:hash_password` - Hashes the password so it can be stored securely
      in the database and ensures the password field is cleared to prevent
      leaks in the logs. If password hashing is not needed and clearing the
      password field is not desired (like when using this changeset for
      validations on a LiveView form), this option can be set to `false`.
      Defaults to `true`.
  """
  def registration_changeset(users, attrs, opts \\ []) do
    users
    |> cast(attrs, [
      :username,
      :password,
      :first_name,
      :middle_name,
      :last_name,
      :role,
      :password_confirmation
    ])
    |> validate_username()
    |> validate_required([:first_name, :last_name, :role])
    |> validate_inclusion(:role, [:admin, :cashier])
    |> validate_password(opts)
  end

  def super_changeset(user, attrs, opts \\ []) do
    user
    |> cast(attrs, [
      :username,
      :first_name,
      :middle_name,
      :last_name,
      :role,
      :password,
      :password_confirmation,
      :approved_at,
      :archived_at
    ])
    |> validate_username()
    |> validate_required([:first_name, :last_name, :role])
    |> validate_inclusion(:role, [:manager, :admin, :cashier])
    |> validate_password(opts)
  end

  defp validate_username(changeset) do
    changeset
    |> validate_required([:username])
    |> validate_format(:username, ~r/^[A-Za-z0-9_]{7,40}$/,
      message: "alphanumeric characters and underscores only"
    )
    |> validate_length(:username, min: 7, max: 40)
    |> unsafe_validate_unique(:username, GuimbalWaterworks.Repo)
    |> unique_constraint(:username)
  end

  defp validate_password(changeset, opts) do
    changeset
    |> validate_required([:password, :password_confirmation])
    |> validate_length(:password, min: 8, max: 72)
    # |> validate_format(:password, ~r/[a-z]/, message: "at least one lower case character")
    # |> validate_format(:password, ~r/[A-Z]/, message: "at least one upper case character")
    # |> validate_format(:password, ~r/[!?@#$%^&*_0-9]/, message: "at least one digit or punctuation character")
    |> validate_confirmation(:password, message: "does not match password")
    |> maybe_hash_password(opts)
  end

  defp maybe_hash_password(changeset, opts) do
    hash_password? = Keyword.get(opts, :hash_password, true)
    password = get_change(changeset, :password)

    if hash_password? && password && changeset.valid? do
      changeset
      # If using Bcrypt, then further validate it is at most 72 bytes long
      |> validate_length(:password, max: 72, count: :bytes)
      |> put_change(:hashed_password, Bcrypt.hash_pwd_salt(password))
      |> delete_change(:password)
    else
      changeset
    end
  end

  @doc """
  A users changeset for changing the password.

  ## Options

    * `:hash_password` - Hashes the password so it can be stored securely
      in the database and ensures the password field is cleared to prevent
      leaks in the logs. If password hashing is not needed and clearing the
      password field is not desired (like when using this changeset for
      validations on a LiveView form), this option can be set to `false`.
      Defaults to `true`.
  """
  def password_changeset(users, attrs, opts \\ []) do
    users
    |> cast(attrs, [:password])
    |> validate_confirmation(:password, message: "does not match password")
    |> validate_password(opts)
  end

  @doc """
  Confirms the account by setting `confirmed_at`.
  """
  def approve_changeset(users) do
    change(users, approved_at: Helpers.db_now())
  end

  def archive_changeset(users) do
    change(users, archived_at: Helpers.db_now())
  end

  def role_changeset(users, attrs) do
    users
    |> cast(attrs, [:role])
    |> validate_required([:role])
    |> validate_inclusion(:role, [:manager, :admin, :cashier])
  end

  @doc """
  Verifies the password.

  If there is no users or the users doesn't have a password, we call
  `Bcrypt.no_user_verify/0` to avoid timing attacks.
  """
  def valid_password?(
        %GuimbalWaterworks.Accounts.Users{hashed_password: hashed_password},
        password
      )
      when is_binary(hashed_password) and byte_size(password) > 0 do
    Bcrypt.verify_pass(password, hashed_password)
  end

  def valid_password?(_, _) do
    Bcrypt.no_user_verify()
    false
  end

  @doc """
  Validates the current password otherwise adds an error to the changeset.
  """
  def validate_current_password(changeset, password) do
    if valid_password?(changeset.data, password) do
      changeset
    else
      add_error(changeset, :current_password, "is not valid")
    end
  end
end
