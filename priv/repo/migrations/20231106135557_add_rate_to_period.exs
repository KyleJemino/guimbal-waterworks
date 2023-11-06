defmodule GuimbalWaterworks.Repo.Migrations.AddRateToPeriod do
  use Ecto.Migration

  def change do
    alter table(:billing_periods) do
      remove :personal_rate
      remove :business_rate
      remove :franchise_tax_rate
      add :rate_id, references(:rates, type: :binary_id), null: false
    end
    
    create index(:billing_periods, [:rate_id], name: :periods_rates_idx)
  end
end
