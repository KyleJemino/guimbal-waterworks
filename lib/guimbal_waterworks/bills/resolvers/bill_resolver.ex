defmodule GuimbalWaterworks.Bills.Resolvers.BillResolver do
  alias GuimbalWaterworks.Repo
  alias GuimbalWaterworks.Bills.Bill
  alias GuimbalWaterworks.Bills.Queries.BillQuery, as: BQ
  alias GuimbalWaterworks.Bills.BillingPeriod
  alias GuimbalWaterworks.Members.Member

  def list_bills(params \\ %{}) do
    params
    |> BQ.query_bill()
    |> Repo.all()
  end

  def get_bill_by_id(id) do
    %{"id" => id}
    |> BQ.query_bill()
    |> Repo.one()
  end

  def get_bill(params \\ %{}) do
    params
    |> BQ.query_bill()
    |> Repo.one()
  end

  def create_bill(params \\ %{}) do
    %Bill{}
    |> Bill.changeset(params)
    |> Repo.insert()
  end

  def change_bill(%Bill{} = bill, params \\ %{}) do
    Bill.changeset(bill, params)
  end

  def new_bill(params) do
    params_with_defaults =
      params
      |> Map.merge(
        %{
          membership_fee?: false,
          adv_fee?: false,
          reconnection_fee?: false
        },
        fn _k, v1, _v2 -> v1 end
      )

    struct(Bill, params_with_defaults)
  end

  def calculate_bill(%Bill{
    billing_period: %BillingPeriod{} = billing_period,
    member: %Member{type: member_type}
  } = bill) do
    %{
      reading: reading,
      adv_fee?: adv_fee?,
      membership_fee?: membership_fee?,
      reconnection_fee?: reconnection_fee?
    } = bill

    %{
      personal_rate: personal_rate,
      business_rate: business_rate,
      franchise_tax_rate: tax_rate,
      due_date: due_date
    } = billing_period

    base_rate = 
      case member_type do
        :personal -> personal_rate
        :business_rate -> business_rate
      end

    base_amount = base_rate * reading
    franchise_tax_amount = base_amount * tax_rate
    adv_amount = if adv_fee?, do: 150, else: 0
    membership_amount = if membership_fee?, do: 100, else: 0
    reconnection_amount = if reconnection_fee?, do: 100, else: 0
    is_overdue = Date.diff(Date.utc_today(), due_date) > 0

    surcharge = if is_overdue, do: 20, else: 0
    total = base_amount + franchise_tax_amount + adv_amount + membership_amount + reconnection_amount + surcharge

    {:ok, %{
      base_amount: base_amount,
      franchise_tax_amount: franchise_tax_amount,
      adv_amount: adv_amount,
      membership_amount: membership_amount,
      reconnection_amount: reconnection_amount,
      surcharge: surcharge,
      total: total
    }}
  end

  def calculate_bill(), do: {:error, nil}
end
