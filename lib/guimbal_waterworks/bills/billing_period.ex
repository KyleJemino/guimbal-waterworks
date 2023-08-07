defmodule GuimbalWaterworks.Bills.BillingPeriod do
  use Ecto.Schema
  import Ecto.Changeset

  schema "billing_periods" do
    field :due_date, :date
    field :from, :date
    field :month, :string
    field :to, :date
    field :year, :string

    timestamps()
  end

  @doc false
  def changeset(billing_period, attrs) do
    billing_period
    |> cast(attrs, [:from, :to, :month, :year, :due_date])
    |> validate_required([:from, :to, :month, :year, :due_date])
  end
end
