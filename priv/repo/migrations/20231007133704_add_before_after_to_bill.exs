defmodule GuimbalWaterworks.Repo.Migrations.AddBeforeAfterToBill do
  use Ecto.Migration

  def change do
    alter table(:bills) do
      add :before, :integer, null: false
      add :after, :integer, null: false
    end
  end
end
