defmodule GuimbalWaterworks.Repo.Migrations.AlterMembersAddArchivedBy do
  use Ecto.Migration

  def change do
    alter table(:members) do
      add :archived_by, references(:users, type: :binary_id)
    end
  end
end
