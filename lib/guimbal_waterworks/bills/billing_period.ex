defmodule GuimbalWaterworks.Bills.BillingPeriod do
  use Ecto.Schema
  import Ecto.Changeset

  alias GuimbalWaterworks.Bills.Bill

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
    field :franchise_tax_rate, :decimal

    embeds_many :death_aid_recipients, DeathAidRecipient, on_replace: :delete do
      field :name, :string
    end

    has_many :bills, Bill

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
      :business_rate,
      :franchise_tax_rate
    ])
    |> validate_required([
      :from,
      :to,
      :month,
      :year,
      :due_date,
      :personal_rate,
      :business_rate,
      :franchise_tax_rate
    ])
    |> validate_inclusion(:month, GuimbalWaterworks.Constants.months())
    |> validate_format(:year, ~r/^\d{4}$/)
    |> validate_number(
      :franchise_tax_rate,
      greater_than_or_equal_to: 0,
      less_than_or_equal_to: 1,
      message: "Must be between 0 and 1"
    )
    |> validate_from_and_to()
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

  defp validate_from_and_to(changeset) do
    from = get_change(changeset, :from)
    to = get_change(changeset, :to)

    cond do
      is_nil(from) || is_nil(to) ->
        changeset

      Timex.before?(to, from) ->
        add_error(changeset, :from, "To must be a date after From")

      true ->
        changeset
    end
  end
end
