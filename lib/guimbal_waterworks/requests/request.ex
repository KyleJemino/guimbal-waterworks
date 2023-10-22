defmodule GuimbalWaterworks.Requests.Request do
  use Ecto.Schema

  alias GuimbalWaterworks.Accounts.Users

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "requests" do
    field :token, :string
    field :type, :string
    field :used_at, :utc_datetime
    field :archived_at, :utc_datetime
    field :password, :string, virtual: true, redact: true
    field :password_confirmation, :string, virtual: true, redact: true
    field :username, :string, virtual: true

    belongs to :user, Users

    timestamps()
  end
end
