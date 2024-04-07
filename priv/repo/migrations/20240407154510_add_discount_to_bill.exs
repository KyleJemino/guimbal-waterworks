defmodule GuimbalWaterworks.Repo.Migrations.AddDiscountToBill do
  use Ecto.Migration

  def change do
    alter table(:bills) do
      add :discount, :integer, default: 0
    end
  end
end
