defmodule GuimbalWaterworks.Bills.Payment do
  use Ecto.Schema
  import Ecto.Changeset

  alias GuimbalWaterworks.Bills.Bill
  alias GuimbalWaterworks.Helpers

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "payments" do
    field :or, :integer
    field :paid_at, :utc_datetime

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
