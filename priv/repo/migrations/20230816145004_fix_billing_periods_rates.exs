defmodule GuimbalWaterworks.Repo.Migrations.FixBillingPeriodsRates do
  use Ecto.Migration

  def change do
    alter table(:billing_periods) do
      modify :personal_rate, :decimal, precision: 10, scale: 2, null: false
      modify :business_rate, :decimal, precision: 10, scale: 2, null: false
      add :franchise_tax_rate, :decimal, precision: 3, scale: 2, null: false, default: 0.02
    end
  end
end
