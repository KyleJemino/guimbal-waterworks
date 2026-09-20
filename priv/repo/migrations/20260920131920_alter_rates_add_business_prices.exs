defmodule GuimbalWaterworks.Repo.Migrations.AlterRatesAddBusinessPrices do
  use Ecto.Migration

  def change do
    alter table(:rates) do
      add :business_prices, :map
    end
  end
end
