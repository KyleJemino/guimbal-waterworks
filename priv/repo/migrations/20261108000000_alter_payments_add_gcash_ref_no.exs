defmodule GuimbalWaterworks.Repo.Migrations.AlterPaymentsAddGcashRefNo do
  use Ecto.Migration

  def change do
    alter table(:payments) do
      add :gcash_ref_no, :string
    end

    create unique_index(:payments, [:gcash_ref_no], name: :payments_gcash_ref_no_unique_idx)
  end
end
