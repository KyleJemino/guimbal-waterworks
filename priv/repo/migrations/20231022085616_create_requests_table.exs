defmodule GuimbalWaterworks.Repo.Migrations.CreateRequestsTable do
  use Ecto.Migration

  def change do
    create table(:requests, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :user_id, references(:users, type: :binary_id)
      add :type, :string
      add :token, :text, null: false
      add :used_at, :utc_datetime
      add :archived_at, :utc_datetime

      timestamps()
    end

    create index(:requests, [:user_id], name: :requests_users_idx)
  end
end
