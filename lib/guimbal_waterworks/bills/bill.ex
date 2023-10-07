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
    field :reading, :integer
    field :membership_fee?, :boolean
    field :adv_fee?, :boolean
    field :reconnection_fee?, :boolean

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
      :reading,
      :membership_fee?,
      :adv_fee?,
      :reconnection_fee?,
      :member_id,
      :billing_period_id,
      :user_id,
      :before,
      :after
    ])
    |> validate_required([
      :before,
      :after,
      :reading,
      :membership_fee?,
      :adv_fee?,
      :reconnection_fee?,
      :member_id,
      :billing_period_id,
      :user_id
    ])
    |> foreign_key_constraint(:member_id)
    |> foreign_key_constraint(:billing_period_id)
    |> foreign_key_constraint(:user_id)
    |> validate_number(:reading, greater_than_or_equal_to: 0)
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
end
