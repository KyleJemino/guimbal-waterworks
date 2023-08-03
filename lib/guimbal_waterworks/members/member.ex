defmodule GuimbalWaterworks.Members.Member do
  use Ecto.Schema
  import Ecto.Changeset

  schema "members" do
    field :first_name, :string
    field :last_name, :string
    field :meter_no, :integer
    field :middle_name, :string
    field :street, :string
    field :type, :string
    field :unique_identifier, :string
    field :connected?, :boolean

    timestamps()
  end

  @doc false
  def changeset(member, attrs) do
    member
    |> cast(attrs, [:first_name, :middle_name, :last_name, :unique_identifier, :street, :type, :meter_no, :connected?])
    |> validate_required([:first_name, :last_name, :street, :type, :meter_no, :connected?])
  end
end
