defmodule GuimbalWaterworks.Members.Member do
  use Ecto.Schema
  import Ecto.Changeset

  alias GuimbalWaterworks.Bills.Bill
  alias GuimbalWaterworks.Constants

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "members" do
    field :first_name, :string
    field :last_name, :string
    field :middle_name, :string
    field :unique_identifier, :string
    field :street, :string
    field :type, Ecto.Enum, values: [:personal, :business]
    field :meter_no, :string
    field :connected?, :boolean
    field :mda?, :boolean
    field :archived_at, :utc_datetime

    has_many :bills, Bill

    timestamps()
  end

  @doc false
  def changeset(member, attrs) do
    member
    |> cast(attrs, [
      :first_name,
      :middle_name,
      :last_name,
      :unique_identifier,
      :street,
      :type,
      :meter_no,
      :connected?,
      :mda?
    ])
    |> validate_required([:first_name, :last_name, :street, :type, :connected?, :mda?])
    |> validate_inclusion(:type, [:personal, :business])
    |> validate_inclusion(:street, Constants.streets())
    |> validate_format(:meter_no, ~r/^[0-9]*$/, message: "Numbers only")
    |> unique_constraint(
      :unique_identifier,
      name: :name_combination_unique_idx,
      message:
        "First name, middle name, last name, and unique identifier fields should be unique."
    )
    |> unique_constraint(
      :meter_no,
      name: :members_meter_no_unique_idx,
      message: "Meter number already exists."
    )
  end

  def archive_changeset(member) do
    now =
      DateTime.utc_now()
      |> DateTime.truncate(:second)

    change(member, archived_at: now)
  end
end
