defmodule GuimbalWaterworks.Bills.Rates do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "rates" do
    field :reconnection_fee, :decimal
    field :membership_fee, :decimal
    field :surcharge_fee, :decimal
    field :tax_rate, :decimal

    embeds_many :usage_rates, UsageRate, on_replace: :delete do
      field :reading, :integer
      field :reading_rate, :decimal
    end

    timestamps()
  end

  def changeset(rate, attrs) do
    rate
    |> cast(attrs, [
      :reconnection_fee,
      :surcharge_fee,
      :membership_fee,
      :tax_rate
    ])
    |> validate_required([
      :reconnection_fee,
      :surcharge_fee,
      :membership_fee,
      :tax_rate
    ])
    |> cast_embed(:usage_rates, with: &usage_rate_changeset/2)
  end

  def usage_rate_changeset(usage_rate, attrs) do
    usage_rate
    |> cast(attrs, [:reading, :reading_rate])
    |> validate_required([:reading, :reading_rate])
  end
end
