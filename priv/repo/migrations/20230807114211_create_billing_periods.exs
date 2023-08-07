defmodule GuimbalWaterworks.Repo.Migrations.CreateBillingPeriods do
  use Ecto.Migration

  def change do
    create table(:billing_periods, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :from, :date, null: false
      add :to, :date, null: false
      add :month, :string, null: false
      add :year, :string, null: false
      add :due_date, :date, null: false
      add :personal_rate, :decimal, precision: 5, scale: 4, null: false
      add :business_rate, :decimal, precision: 5, scale: 4, null: false
      add :death_aid_recipient, {:array, :map}

      timestamps()
    end

    create unique_index(
      :billing_periods,
      [:month, :year],
      name: :billing_periods_month_year_unique_idx
    )
  end
end
