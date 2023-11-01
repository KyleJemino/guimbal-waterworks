defmodule GuimbalWaterworks.Bills.Rate do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "rates" do
    field :title, :string
    field :reconnection_fee, :decimal
    field :membership_fee, :decimal
    field :surcharge_fee, :decimal
    field :tax_rate, :decimal
    field :usage_rates, :map

    timestamps()
  end

  def changeset(rate, attrs) do
    rate
    |> cast(attrs, [
      :reconnection_fee,
      :surcharge_fee,
      :membership_fee,
      :tax_rate,
      :title,
      :usage_rates
    ])
    |> validate_required([
      :reconnection_fee,
      :surcharge_fee,
      :membership_fee,
      :tax_rate,
      :title,
      :usage_rates
    ])
  end
end
