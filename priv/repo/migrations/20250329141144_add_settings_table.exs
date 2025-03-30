defmodule GuimbalWaterworks.Repo.Migrations.AddSettingsTable do
  use Ecto.Migration

  def change do
    add :id, :binary_id, primary_key: true
    add :contact_number, :string, null: false
    add :address, :string, null: false
  end
end
