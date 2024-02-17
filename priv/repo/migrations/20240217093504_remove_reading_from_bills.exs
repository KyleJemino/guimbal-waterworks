defmodule GuimbalWaterworks.Repo.Migrations.RemoveReadingFromBills do
  use Ecto.Migration

  def change do
    alter table(:bills) do
      remove :reading
    end
  end
end
