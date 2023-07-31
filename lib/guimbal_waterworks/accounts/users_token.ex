defmodule GuimbalWaterworks.Accounts.UsersToken do
  use Ecto.Schema
  import Ecto.Query
  alias GuimbalWaterworks.Accounts.UsersToken

  @hash_algorithm :sha256
  @rand_size 32

  # It is very important to keep the reset password token expiry short,
  # since someone with access to the email may take over the account.
  @reset_password_validity_in_days 1
  @confirm_validity_in_days 7
  @change_email_validity_in_days 7
  @session_validity_in_days 60

  schema "users_tokens" do
    field :token, :binary
    field :context, :string
    field :sent_to, :string
    belongs_to :users, GuimbalWaterworks.Accounts.Users

    timestamps(updated_at: false)
  end

  @doc """
  Generates a token that will be stored in a signed place,
  such as session or cookie. As they are signed, those
  tokens do not need to be hashed.

  The reason why we store session tokens in the database, even
  though Phoenix already provides a session cookie, is because
  Phoenix' default session cookies are not persisted, they are
  simply signed and potentially encrypted. This means they are
  valid indefinitely, unless you change the signing/encryption
  salt.

  Therefore, storing them allows individual users
  sessions to be expired. The token system can also be extended
  to store additional data, such as the device used for logging in.
  You could then use this information to display all valid sessions
  and devices in the UI and allow users to explicitly expire any
  session they deem invalid.
  """
  def build_session_token(users) do
    token = :crypto.strong_rand_bytes(@rand_size)
    {token, %UsersToken{token: token, context: "session", users_id: users.id}}
  end

  @doc """
  Checks if the token is valid and returns its underlying lookup query.

  The query returns the users found by the token, if any.

  The token is valid if it matches the value in the database and it has
  not expired (after @session_validity_in_days).
  """
  def verify_session_token_query(token) do
    query =
      from token in token_and_context_query(token, "session"),
        join: users in assoc(token, :users),
        where: token.inserted_at > ago(@session_validity_in_days, "day"),
        select: users

    {:ok, query}
  end

  @doc """
  Builds a token and its hash to be delivered to the users's email.

  The non-hashed token is sent to the users email while the
  hashed part is stored in the database. The original token cannot be reconstructed,
  which means anyone with read-only access to the database cannot directly use
  the token in the application to gain access. Furthermore, if the user changes
  their email in the system, the tokens sent to the previous email are no longer
  valid.

  Users can easily adapt the existing code to provide other types of delivery methods,
  for example, by phone numbers.
  """
  defp build_hashed_token(users, context, sent_to) do
    token = :crypto.strong_rand_bytes(@rand_size)
    hashed_token = :crypto.hash(@hash_algorithm, token)

    {Base.url_encode64(token, padding: false),
     %UsersToken{
       token: hashed_token,
       context: context,
       sent_to: sent_to,
       users_id: users.id
     }}
  end

  defp days_for_context("confirm"), do: @confirm_validity_in_days
  defp days_for_context("reset_password"), do: @reset_password_validity_in_days

  @doc """
  Returns the token struct for the given token value and context.
  """
  def token_and_context_query(token, context) do
    from UsersToken, where: [token: ^token, context: ^context]
  end

  @doc """
  Gets all tokens for the given users for the given contexts.
  """
  def users_and_contexts_query(users, :all) do
    from t in UsersToken, where: t.users_id == ^users.id
  end

  def users_and_contexts_query(users, [_ | _] = contexts) do
    from t in UsersToken, where: t.users_id == ^users.id and t.context in ^contexts
  end
end
