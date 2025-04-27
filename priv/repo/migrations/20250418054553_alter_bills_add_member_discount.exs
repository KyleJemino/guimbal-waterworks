defmodule GuimbalWaterworks.Repo.Migrations.AlterBillsAddMemberDiscount do
  use Ecto.Migration

  def change do
    alter table(:bills) do
      add :member_discount, :decimal, precision: 10, scale: 2, default: 0
    end
  end
end
