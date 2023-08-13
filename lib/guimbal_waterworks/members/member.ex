defmodule GuimbalWaterworks.Members.Member do
  use Ecto.Schema
  import Ecto.Changeset

  alias GuimbalWaterworks.Bills.Bill

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "members" do
    field :first_name, :string
    field :last_name, :string
    field :meter_no, :integer
    field :middle_name, :string
    field :street, :string
    field :type, Ecto.Enum, values: [:personal, :business]
    field :unique_identifier, :string
    field :connected?, :boolean
    field :mda?, :boolean
    field :archived_at, :utc_datetime

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
    |> validate_required([:first_name, :last_name, :street, :type, :meter_no, :connected?, :mda?])
    |> validate_inclusion(:type, [:personal, :business])
    |> unique_constraint(
      :unique_identifier,
      name: :name_combination_unique_idx,
      message:
        "First name, middle name, last name, and unique identifier fields should be unique."
    )
    |> unique_constraint(
      :meter_no,
      name: :uniq_active_meter_no_idx,
      message: "Meter number already exists."
    )

    has_many :bills, Bill
  end

  def archive_changeset(member) do
    now =
      DateTime.utc_now()
      |> DateTime.truncate(:second)

    change(member, archived_at: now)
  end
end
