defmodule GuimbalWaterworks.Repo.Migrations.AddAmountToPayments do
  use Ecto.Migration

  def change do
    alter table(:payments) do
      add :amount, :decimal, precision: 10, scale: 2, null: false
    end
  end
end
