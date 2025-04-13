defmodule GuimbalWaterworks.Bills.Bill do
  use Ecto.Schema
  import Ecto.Changeset

  alias GuimbalWaterworks.Members.Member

  alias GuimbalWaterworks.Bills.{
    BillingPeriod,
    Payment
  }

  alias GuimbalWaterworks.Accounts.Users

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "bills" do
    field :before, :integer
    field :after, :integer
    field :membership_fee?, :boolean
    field :reconnection_fee, :decimal, default: 0
    field :discount, :integer, default: 0

    belongs_to :member, Member
    belongs_to :billing_period, BillingPeriod
    belongs_to :user, Users
    belongs_to :payment, Payment

    timestamps()
  end

  @doc false
  def changeset(bill, attrs) do
    bill
    |> cast(attrs, [
      :membership_fee?,
      :reconnection_fee?,
      :member_id,
      :billing_period_id,
      :user_id,
      :before,
      :after,
      :discount
    ])
    |> validate_required([
      :before,
      :after,
      :membership_fee?,
      :reconnection_fee?,
      :member_id,
      :billing_period_id,
      :user_id,
      :discount
    ])
    |> foreign_key_constraint(:member_id)
    |> foreign_key_constraint(:billing_period_id)
    |> foreign_key_constraint(:user_id)
    |> validate_from_before()
    |> unique_constraint(
      :billing_period_id,
      name: :bills_members_periods_uniq_idx,
      message: "Member already has an existing bill for this billing period."
    )
  end

  def payment_changeset(bill, %Payment{id: payment_id}) do
    bill
    |> change(payment_id: payment_id)
    |> foreign_key_constraint(:payment_id)
  end

  defp validate_from_before(changeset) do
    before_reading = fetch_field!(changeset, :before) || 0
    after_reading = fetch_field!(changeset, :after) || nil

    if not is_nil(after_reading) && before_reading > after_reading do
      changeset
      |> add_error(:before, "Before value must be less than or equal to after value")
      |> add_error(:after, "After value must be greater than or equal to before value")
    else
      changeset
    end
  end
end
