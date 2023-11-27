defmodule GuimbalWaterworks.Repo.Migrations.MakeOrString do
  use Ecto.Migration

  def change do
    alter table(:payments) do
      modify :or, :string, null: false
    end
  end
end
