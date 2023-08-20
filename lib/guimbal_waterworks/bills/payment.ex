defmodule GuimbalWaterworks.Bills.Payment do
  use Ecto.Schema
  import Ecto.Changeset

  alias GuimbalWaterworks.Members.Member
  alias GuimbalWaterworks.Bills.Bill
  alias GuimbalWaterworks.Helpers
  alias GuimbalWaterworks.Accounts.Users

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "payments" do
    field :or, :integer
    field :paid_at, :utc_datetime
    field :bill_ids, {:array, :binary_id}, virtual: true
    belongs_to :member, Member
    belongs_to :user, Users

    has_many :bills, Bill

    timestamps()
  end

  def changeset(payment, attrs) do
    payment
    |> cast(attrs,[:or, :member_id, :user_id, :bill_ids])
    |> validate_required([:or, :member_id, :user_id, :bill_ids])
    |> foreign_key_constraint(:member_id)
    |> foreign_key_constraint(:user_id)
    |> validate_bill_ids_length()
    |> put_change(:paid_at, Helpers.db_now())
  end

  defp validate_bill_ids_length(changeset) do
    bill_ids = get_change(changeset, :bill_ids)

    changeset = delete_change(changeset, :bill_ids)

    if (not is_nil(bill_ids)) and Enum.count(bill_ids) < 1 do
      add_error(changeset, :bill_ids, "no bills to pay")
    else
      changeset
    end
  end
end
