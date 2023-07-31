defmodule GuimbalWaterworks.Repo.Migrations.ModifyUsersTable do
  use Ecto.Migration

  def change do
    drop_if_exists unique_index(:users, [:email])

    alter table(:users) do
      remove :email, :citext, null: false
      remove :confirmed_at, :naive_datetime
      add :username, :string, null: false
      add :approved_at, :utc_datetime
      add :first_name, :string, null: false
      add :middle_name, :string
      add :last_name, :string, null: false
      add :role, :string, null: false
    end

    create unique_index(:users, [:username])
  end
end
