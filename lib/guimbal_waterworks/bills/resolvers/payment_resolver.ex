defmodule GuimbalWaterworks.Bills.Resolvers.PaymentResolver do
  alias GuimbalWaterworks.Repo
  alias Ecto.Multi
  alias Ecto.Changeset

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.{
    Payment,
    Bill
  }

  alias GuimbalWaterworks.Bills.Resolvers.BillResolver
  alias GuimbalWaterworks.Bills.Queries.PaymentQuery, as: PQ

  def list_payments(params \\ %{}) do
    params
    |> PQ.query_payment()
    |> Repo.all()
  end

  def create_payment(%{"bill_ids" => bill_ids_string, "member_id" => member_id} = params) when is_binary(bill_ids_string) and bill_ids_string != ""  do
    reconnection_fee =
      params
      |> Map.get("reconnection_fee", "0.00")
      |> Decimal.new()

    discount_rate =
      params
      |> Map.get("discount_rate", "0.00")
      |> Decimal.new()

    senior_id =
      Map.get(params, "senior_id")

    Multi.new()
    |> Multi.run(:bills, fn _repo, _opts ->
      bill_ids_string
      |> String.split(",")
      |> Enum.reduce({:ok, []}, fn
        bill_id, {:ok, acc} ->
          bill_params = %{
            "id" => bill_id,
            "member_id" => member_id,
            "preload" => [:member, :payment, billing_period: [:rate]]
          }

        case BillResolver.get_bill(bill_params) do
          %Bill{} = bill ->
            {:ok, acc ++ [bill]}

          _ ->
            payment_changeset =
              %Payment{}
              |> change_payment(params)
              |> Changeset.add_error(:bill_ids, "Invalid bills")
              |> Map.put(:action, :validate)

            {:error, payment_changeset}
        end
      end)
    end)
    |> Multi.run(:last_bill_with_reconnection_fee, fn _repo, %{bills: bills} ->
      last_bill = List.last(bills)

      if Decimal.gt?(reconnection_fee, Decimal.new("0.00")) do
        last_bill
        |> Bill.reconnection_changeset(reconnection_fee)
        |> Repo.update()
      else
        {:ok, last_bill}
      end
    end)
    |> Multi.run(:updated_bills, fn _repo, %{bills: bills, last_bill_with_reconnection_fee: last_bill} ->
      bills
      |> Enum.map(fn bill ->
        if bill.id == last_bill.id do
          last_bill
        else
          bill
        end
      end)
      |> Enum.reduce({:ok, []}, fn
        bill, {:ok, bill_acc} ->
          bill_discount_changeset =
            bill
            |> Bills.calculate_bill_discount(discount_rate)
            |> then(fn discount ->
              Bill.member_discount_changeset(bill, discount, senior_id)
            end)

          case Repo.update(bill_discount_changeset) do
            {:ok, bill} ->
              {:ok, bill_acc ++ [bill]}

            {:error, changeset} ->
              {:error, changeset}
          end

        _bill, acc ->
          acc
      end)
      |> case do
        {:ok, bills} -> {:ok, bills}
        {:error, changeset} ->
           payment_changeset =
             %Payment{}
             |> change_payment(params)
             |> Changeset.add_error(:senior_id, "Can't be blank if discounted")
             |> Map.put(:action, :validate)
      end
    end)
    |> Multi.run(:bill_ids, fn _repo, %{updated_bills: bills} ->
      {:ok, Enum.map(bills, &(&1.id))}
    end)
    |> Multi.insert(:payment, fn ops ->
      %{updated_bills: bills, bill_ids: bill_ids} = ops

      total =
        Enum.reduce(bills, Decimal.new("0.00"),
          fn bill, acc ->
            bill
            |> Bills.get_bill_total()
            |> Decimal.add(acc)
          end
        )

      payment_params = Map.merge(params, %{
        "bill_ids" => Enum.join(bill_ids, ","),
        "amount" => total
      })

      Payment.save_changeset(%Payment{}, payment_params)
    end)
    |> Multi.update_all(
      :pay_bills,
      fn %{payment: payment, bill_ids: bill_ids} ->
        import Ecto.Query

        Bill
        |> where([b], b.id in ^bill_ids)
        |> update(set: [payment_id: ^payment.id])
      end,
      []
    )
    |> Repo.transaction()
  end

  def create_payment(params) do
    payment_changeset =
      %Payment{}
      |> change_payment(params)
      |> Changeset.add_error(:bill_ids, "Invalid bills")
      |> Map.put(:action, :validate)

    {:error, payment_changeset}
  end

  def edit_payment(%Payment{} = payment, attrs \\ %{}) do
    payment
    |> Payment.edit_changeset(attrs)
    |> Repo.update()
  end

  def change_payment(%Payment{} = payment, params \\ %{}), do: Payment.changeset(payment, params)

  def count_payments(params \\ %{}) do
    params
    |> PQ.query_payment()
    |> Repo.aggregate(:count)
  end

  def late_payment?(payment, billing_period) do
    paid_at_date = DateTime.to_date(payment.paid_at)
    Date.diff(paid_at_date, billing_period.due_date) > 0
  end
end
