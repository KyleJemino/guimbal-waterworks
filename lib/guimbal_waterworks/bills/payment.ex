defmodule GuimbalWaterworks.Bills.Payment do
  use Ecto.Schema
  import Ecto.Changeset

  alias GuimbalWaterworks.Members.Member
  alias GuimbalWaterworks.Bills.Bill
  alias GuimbalWaterworks.Helpers
  alias GuimbalWaterworks.Accounts.Users

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "payments" do
    field :or, :integer
    field :paid_at, :utc_datetime
    field :bill_ids, {:array, :binary_id}, virtual: true
    belongs_to :member, Member
    belongs_to :user, Users

    has_many :bills, Bill

    timestamps()
  end

  def changeset(payment, attrs) do
    payment
    |> cast(attrs,[:or])
    |> validate_required([:or])
    |> put_change(:paid_at, Helpers.db_now())
  end
end
