defmodule GuimbalWaterworks.Repo.Migrations.AlterRatesAddDiscountRates do
  use Ecto.Migration

  def change do
    alter table(:rates) do
      add :discount_rates, {:array, :decimal}, default: []
    end
  end
end
