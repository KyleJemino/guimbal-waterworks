defmodule GuimbalWaterworks.Requests.Request do
  use Ecto.Schema
  import Ecto.Changeset

  alias GuimbalWaterworks.Accounts.Users

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "requests" do
    field :token, :string
    field :type, :string
    field :used_at, :utc_datetime
    field :archived_at, :utc_datetime

    belongs to :user, Users

    timestamps()
  end
end
