defmodule GuimbalWaterworks.Repo.Migrations.AddSeniordIdToBillsTable do
  use Ecto.Migration

  def change do
    alter table(:bills) do
      add :senior_id, :string
    end
  end
end
