defmodule GuimbalWaterworks.Bills.Rate do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "rates" do
    field :title, :string
    field :reconnection_fees, {:array, :decimal}, default: []
    field :discount_rates, {:array, :decimal}, default: []
    field :membership_fee, :decimal
    field :surcharge_fee, :decimal
    field :tax_rate, :decimal
    field :personal_prices, :map
    field :business_rate, :decimal

    timestamps()
  end

  def changeset(rate, attrs) do
    rate
    |> cast(attrs, [
      :reconnection_fees,
      :surcharge_fee,
      :membership_fee,
      :tax_rate,
      :title,
      :personal_prices,
      :business_rate,
      :discount_rates
    ])
    |> validate_required([
      :reconnection_fees,
      :surcharge_fee,
      :membership_fee,
      :tax_rate,
      :title,
      :personal_prices,
      :business_rate,
      :discount_rates
    ])
    |> unique_constraint(
      :title,
      name: :rates_title_uniq_idx,
      message: "Title must be unique"
    )
  end
end
