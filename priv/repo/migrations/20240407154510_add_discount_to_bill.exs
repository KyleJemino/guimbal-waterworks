defmodule GuimbalWaterworks.Repo.Migrations.AddDiscountToBill do
  use Ecto.Migration

  def change do
    alter table(:bills) do
      add :discount_cu_m, :integer, default: 0
    end
  end
end
