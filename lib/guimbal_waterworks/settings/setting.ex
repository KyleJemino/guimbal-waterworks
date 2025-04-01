defmodule GuimbalWaterworks.Settings.Setting do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "setting" do
    field :contact_number, :string
    field :address, :string
  end

  @doc false
  def changeset(setting, attrs \\ %{}) do
    setting
    |> cast(attrs, [:contact_number, :address])
    |> validate_required([:contact_number, :address])
  end
end
