defmodule GuimbalWaterworks.Repo.Migrations.RemoveAdvFeeFromBill do
  use Ecto.Migration

  def change do
    alter table(:bills) do
      remove :adv_fee?
    end
  end
end
