defmodule GuimbalWaterworks.Repo.Migrations.AlterBillAddManualCalculationAmount do
  use Ecto.Migration

  def change do
    alter table(:bills) do
      add :manual_calculation_amount, :decimal, precision: 10, scale: 2
    end
  end
end
