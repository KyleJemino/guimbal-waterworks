defmodule GuimbalWaterworks.Repo.Migrations.CreateMembers do
  use Ecto.Migration

  def change do
    create table(:members, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :first_name, :string, null: false
      add :middle_name, :string
      add :last_name, :string, null: false
      add :unique_identifier, :string
      add :street, :string, null: false
      add :type, :string, null: false
      add :meter_no, :integer, null: false
      add :connected?, :boolean, null: false
      add :mda?, :boolean, null: false

      timestamps()
    end

    create unique_index(
      :members,
      [
        :first_name, 
        "COALESCE(middle_name, 'NULL_VALUE_MIDDLE_NAME')", 
        :last_name,
        "COALESCE(unique_identifier, 'NULL_VALUE_IDENTIFIER')"
      ],
      name: :name_combination_unique_idx
    )

    create unique_index(:members, [:meter_no])
  end
end
