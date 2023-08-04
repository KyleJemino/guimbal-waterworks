defmodule GuimbalWaterworks.Repo.Migrations.AddArchivedAtToMembers do
  use Ecto.Migration

  def change do
    alter table(:members) do
      add :archived_at, :utc_datetime
    end
  end
end
