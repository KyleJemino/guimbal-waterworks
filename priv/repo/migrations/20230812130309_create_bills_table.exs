defmodule GuimbalWaterworks.Repo.Migrations.CreateBillsTable do
  use Ecto.Migration

  def change do
    create table(:bills, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :reading, :integer, null: false
      add :membership_fee?, :boolean, null: false
      add :adv_fee?, :boolean, null: false
      add :reconnection_fee?, :boolean, null: false
      add :member_id, references(:members, type: :binary_id)
      add :billing_period_id, references(:billing_periods, type: :binary_id)
      add :user_id, references(:users, type: :binary_id)

      timestamps()
    end

    create index(
      :bills,
      [:member_id],
      name: :bills_members_idx
    )

    create index(
      :bills,
      [:billing_period_id],
      name: :bills_periods_idx
    )


    create index(
      :bills,
      [:user_id],
      name: :bills_users_idx
    )

    create unique_index(
      :bills,
      [:member_id, :billing_period_id],
      name: :bills_members_periods_uniq_idx
    )
  end
end
