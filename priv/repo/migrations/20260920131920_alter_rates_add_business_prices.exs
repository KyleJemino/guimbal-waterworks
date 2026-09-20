defmodule GuimbalWaterworks.Repo.Migrations.AlterRatesAddBusinessPrices do
  use Ecto.Migration

  def change do
    alter table(:rates) do
      add :business_prices, :map
      modify :business_rate, :decimal, null: true
    end
  end
end
