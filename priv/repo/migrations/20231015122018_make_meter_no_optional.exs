defmodule GuimbalWaterworks.Repo.Migrations.MakeMeterNoOptional do
  use Ecto.Migration

  def up do
    drop_if_exists unique_index(
      :members,
      [:meter_no],
      where: "archived_at is null",
      name: :uniq_active_meter_no_idx
    )

    alter table(:members) do
      modify :meter_no, :string, null: true, from: :integer
    end

    create unique_index(
      :members,
      [:meter_no],
      where: "archived_at is null",
      name: :members_meter_no_unique_idx
    )
  end

  def down do
    drop unique_index(
      :members,
      [:meter_no],
      where: "archived_at is null",
      name: :members_meter_no_unique_idx
    )
  end
end
