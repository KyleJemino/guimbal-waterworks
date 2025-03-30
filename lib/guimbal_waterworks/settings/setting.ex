defmodule GuimbalWaterworks.Settings.Setting do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "setting" do
    field :contact_number, :string, null: false
    field :address, :string, null: false
  end
end
