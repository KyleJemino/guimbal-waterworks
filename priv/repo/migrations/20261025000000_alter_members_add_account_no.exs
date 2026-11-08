defmodule GuimbalWaterworks.Repo.Migrations.AlterMembersAddAccountNo do
  use Ecto.Migration

  def change do
    alter table(:members) do
      add :account_no, :string
    end

    create unique_index(:members, [:account_no], name: :members_account_no_unique_idx)
  end
end
