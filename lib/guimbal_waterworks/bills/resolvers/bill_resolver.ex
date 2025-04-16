defmodule GuimbalWaterworks.Bills.Resolvers.BillResolver do
  alias GuimbalWaterworks.Repo
  alias Decimal, as: D

  alias GuimbalWaterworks.Bills

  alias GuimbalWaterworks.Bills.{
    Bill,
    Rate,
    BillingPeriod
  }

  alias GuimbalWaterworks.Bills.Queries.BillQuery, as: BQ
  alias GuimbalWaterworks.Bills.Resolvers.BillingPeriodResolver, as: BPR
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

  def update_bill(bill, params) do
    bill
    |> Bill.changeset(params)
    |> Repo.update()
  end

  def new_bill(params) do
    params_with_defaults =
      params
      |> Map.merge(
        %{
          membership_fee?: false,
          reconnection_fee?: false
        },
        fn _k, v1, _v2 -> v1 end
      )

    struct(Bill, params_with_defaults)
  end

  def calculate_bill(bill, billing_period, member, payment, rate, discounted? \\ false) do
    %{
      membership_fee?: membership_fee?,
      reconnection_fee: reconnection_fee
    } = bill

    %{
      mda?: mda?,
      type: type
    } = member

    reading = get_bill_reading(bill)

    %{
      due_date: due_date
    } = billing_period

    base_amount =
      cond do
        Decimal.lt?(reading, "0") ->
          D.new("0")

        type == :personal ->
          rate.personal_prices
          |> Map.get("#{reading}")
          |> case do
            nil ->
              rate
              |> Bills.max_personal_rate()
              |> elem(1)
              |> D.new()

            reading ->
              D.new(reading)
          end

        type == :business ->
          if reading < 10 do
            D.mult(rate.business_rate, 10)
          else
            D.mult(rate.business_rate, reading)
          end
      end

    tax_rate = D.new(rate.tax_rate)

    franchise_tax_amount = D.mult(base_amount, tax_rate)

    membership_amount = D.new(if membership_fee?, do: rate.membership_fee, else: 0)

    reconnection_amount = D.new(reconnection_fee)

    date_to_compare = if not is_nil(payment), do: payment.paid_at, else: Date.utc_today()

    is_overdue = Date.diff(date_to_compare, due_date) > 0
    surcharge_amount = D.new(if is_overdue, do: rate.surcharge_fee, else: 0)

    death_aid_amount =
      if mda? do
        billing_period.death_aid_recipients
        |> Enum.count()
        |> D.mult(10)
      else
        D.new(0)
      end

    total =
      base_amount
      |> D.add(franchise_tax_amount)
      |> D.add(membership_amount)
      |> D.add(reconnection_amount)
      |> D.add(surcharge_amount)
      |> D.add(death_aid_amount)

    {:ok,
     %{
       base_amount: base_amount,
       franchise_tax_amount: franchise_tax_amount,
       membership_amount: membership_amount,
       reconnection_amount: reconnection_amount,
       surcharge: surcharge_amount,
       death_aid_amount: death_aid_amount,
       total: total
     }}
  end

  def calculate_bill(
        %Bill{} = bill,
        %BillingPeriod{
          rate: %Rate{} = rate
        } = billing_period,
        %Member{} = member,
        payment
      ),
      do: calculate_bill(bill, billing_period, member, payment, rate)

  def calculate_bill(_bill, _period, _member, _payment), do: {:error, nil}

  def calculate_bill(bill, discounted \\ false) do
    calculate_bill(bill, bill.billing_period, bill.member, bill.payment, discounted)
  end
  def calculate_bill!(
        %{
          billing_period: period,
          member: member,
          payment: payment
        } = bill,
        discounted \\ false
      ) do
    {:ok, result} = calculate_bill(bill, period, member, payment, period.rate, discounted)

    result
  end

  def get_bill_total(%Bill{} = bill) do
    {:ok, %{total: total}} = calculate_bill(bill, bill.billing_period, bill.member, bill.payment)
    total
  end

  def get_bill_total(bills) when is_list(bills) do
    Enum.reduce(bills, 0, fn bill, acc ->
      {:ok, %{total: total}} =
        calculate_bill(bill, bill.billing_period, bill.member, bill.payment)

      D.add(acc, total)
    end)
  end

  def count_bills(params \\ %{}) do
    params
    |> BQ.query_bill()
    |> Repo.aggregate(:count)
  end

  def get_bill_reading(%Bill{before: before, after: after_reading, discount: discount}) do
    after_reading
    |> Decimal.sub(before)
    |> Decimal.sub(discount || 0)
  end

  def get_previous_bill(member_id, billing_period_id) do
    with %BillingPeriod{due_date: due_date} <-
           BPR.get_billing_period(%{"id" => billing_period_id}),
         %Bill{} = previous_bill <-
           get_bill(%{
             "last_member_bill_before" => %{"before_date" => due_date, "member_id" => member_id}
           }) do
      previous_bill
    else
      _result ->
        nil
    end
  end
end
