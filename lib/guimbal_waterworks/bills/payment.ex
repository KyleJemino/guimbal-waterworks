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
    field :or, :string
    field :paid_at, :utc_datetime
    field :bill_ids, :string, virtual: true
    field :reconnection_fee, :decimal, virtual: true
    field :discount_rate, :decimal, virtual: true
    field :senior_id, :string, virtual: true
    field :amount, :decimal
    belongs_to :member, Member
    belongs_to :user, Users

    has_many :bills, Bill

    timestamps()
  end

  def changeset(payment, attrs) do
    payment
    |> cast(attrs, [:or, :member_id, :user_id, :bill_ids, :discount_rate, :senior_id])
    |> validate_required([:or, :member_id, :user_id, :bill_ids])
    |> unique_constraint(:or, name: :payments_ors_uniq_idx)
    |> foreign_key_constraint(:member_id)
    |> foreign_key_constraint(:user_id)
    |> validate_format(:or, ~r/\d+/)
    |> validate_bill_ids_length()
    |> maybe_validate_senior_id()
    |> put_change(:paid_at, Helpers.db_now())
  end

  def save_changeset(payment, attrs) do
    payment
    |> changeset(attrs)
    |> cast(attrs, [:amount])
    |> validate_required([:amount])
  end

  def edit_changeset(payment, attrs) do
    cast(payment, attrs, [:or])
  end

  defp validate_bill_ids_length(changeset) do
    bill_ids =
      changeset
      |> get_change(:bill_ids, "")

    changeset = delete_change(changeset, :bill_ids)

    if is_nil(bill_ids) or bill_ids == "" do
      add_error(changeset, :bill_ids, "No bills selected.")
    else
      changeset
    end
  end

  defp maybe_validate_senior_id(changeset) do
    discount_rate =
      changeset
      |> get_change(:discount_rate, "0.00")
      |> Decimal.new()

    if Decimal.gt?(discount_rate, 0) do
      validate_required(changeset, [:senior_id], message: "Can't be blank if discounted")
    else
      changeset
    end
  end
end
