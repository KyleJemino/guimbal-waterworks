defmodule GuimbalWaterworks.Bills.BillingPeriod do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "billing_periods" do
    field :from, :date
    field :to, :date
    field :month, :string
    field :year, :string
    field :due_date, :date
    field :personal_rate, :decimal
    field :business_rate, :decimal

    embeds_many :death_aid_recipients, DeathAidRecipient do
      field :name, :string
    end

    timestamps()
  end

  @doc false
  def changeset(billing_period, attrs) do
    billing_period
    |> cast(attrs, [
      :from, 
      :to, 
      :month, 
      :year, 
      :due_date,
      :personal_rate,
      :business_rate
    ])
    |> validate_required([
      :from, 
      :to, 
      :month, 
      :year, 
      :due_date,
      :personal_rate,
      :business_rate
    ])
    |> validate_inclusion(:month, GuimbalWaterworks.Constants.months())
    |> validate_format(:year, ~r/^\d{4}$/)
    |> unique_constraint(
      :month,
      name: :billing_periods_month_year_unique_idx,
      message: "Billing period already exists for this month and year."
    )
    |> cast_embed(:death_aid_recipients, with: &death_aid_recipient_changeset/2)
  end

  def death_aid_recipient_changeset(death_aid_recipient, params) do
    death_aid_recipient
    |> cast(params, [:name])
    |> validate_required([:name])
  end
end
