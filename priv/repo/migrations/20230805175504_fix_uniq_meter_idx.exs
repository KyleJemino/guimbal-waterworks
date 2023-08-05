defmodule GuimbalWaterworks.Repo.Migrations.FixUniqMeterIdx do
  use Ecto.Migration

  def change do
    drop unique_index(:members, [:meter_no])

    create unique_index(
      :members, 
      [:meter_no], 
      where: "archived_at is null",
      name: :uniq_active_meter_no_idx
    )
  end
end
