defmodule GuimbalWaterworks.Repo.Migrations.CreatePaymentsTable do
  use Ecto.Migration

  def change do
    create table(:payments, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :or, :integer, null: false
      add :paid_at, :utc_datetime, null: false
      add :member_id, references(:members, type: :binary_id)
      add :user_id, references(:users, type: :binary_id)

      timestamps()
    end

    create index(:payments, [:member_id], name: :payments_member_idx)
    create index(:payments, [:user_id], name: :payments_users_idx)
    create unique_index(:payments, [:or], name: :payments_ors_uniq_idx)

    alter table(:bills) do
      add :payment_id, references(:payments, type: :binary_id)
    end

    create index(:bills, [:payment_id], name: :bills_payments_idx)
  end
end
