defmodule GuimbalWaterworks.Repo.Migrations.CreateRatesTable do
  use Ecto.Migration

  def change do
    create table(:rates, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :title, :string, null: false
      add :personal_prices, :map, null: false
      add :business_rate, :decimal, precision: 10, scale: 2, null: false
      add :reconnection_fee, :decimal, precision: 10, scale: 2, null: false
      add :membership_fee, :decimal, precision: 10, scale: 2, null: false
      add :surcharge_fee, :decimal, precision: 10, scale: 2, null: false
      add :tax_rate, :decimal, precision: 3, scale: 2, null: false, default: 0.02

      timestamps()
    end

    create unique_index(
             :rates,
             [:title],
             name: :rates_title_uniq_idx
           )
  end
end
