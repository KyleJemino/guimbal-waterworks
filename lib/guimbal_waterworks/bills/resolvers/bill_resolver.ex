defmodule GuimbalWaterworks.Bills.Resolvers.BillResolver do
  alias GuimbalWaterworks.Repo
  alias Decimal, as: D

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

  def calculate_bill(
        %Bill{} = bill,
        %BillingPeriod{} = billing_period,
        %Member{
          type: member_type
        }
      )
      when member_type in [:personal, :business] do
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
        :business -> business_rate
      end

    base_amount = D.mult(base_rate, reading)
    franchise_tax_amount = D.mult(base_amount, tax_rate)
    adv_amount = D.new(if adv_fee?, do: 150, else: 0)

    membership_amount = D.new(if membership_fee?, do: 100, else: 0)

    reconnection_amount = D.new(if reconnection_fee?, do: 100, else: 0)

    is_overdue = Date.diff(Date.utc_today(), due_date) > 0
    surcharge_amount = D.new(if is_overdue, do: 20, else: 0)

    total =
      base_amount
      |> D.add(franchise_tax_amount)
      |> D.add(adv_amount)
      |> D.add(membership_amount)
      |> D.add(reconnection_amount)
      |> D.add(surcharge_amount)

    {:ok,
     %{
       base_amount: base_amount,
       franchise_tax_amount: franchise_tax_amount,
       adv_amount: adv_amount,
       membership_amount: membership_amount,
       reconnection_amount: reconnection_amount,
       surcharge: surcharge_amount,
       total: total
     }}
  end

  def calculate_bill(_bill, _period, _member), do: {:error, nil}

  def get_bill_total(%Bill{} = bill) do
    {:ok, %{total: total}} = calculate_bill(bill, bill.billing_period, bill.member)
    total
  end

  def get_bill_total(bills) when is_list(bills) do
    Enum.reduce(bills, 0, fn bill, acc ->
      {:ok, %{total: total}} = calculate_bill(bill, bill.billing_period, bill.member)

      D.add(acc, total)
    end)
  end
end
