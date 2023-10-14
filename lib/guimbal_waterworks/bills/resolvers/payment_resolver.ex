defmodule GuimbalWaterworks.Bills.Resolvers.PaymentResolver do
  alias GuimbalWaterworks.Repo
  alias Ecto.Multi
  alias Ecto.Changeset

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

  def create_payment(%{"bill_ids" => bill_ids_string, "member_id" => member_id} = params) do
    Multi.new()
    |> Multi.run(:bills_and_total, fn _repo, _ops ->
      bill_ids_string
      |> String.split(",")
      |> Enum.reduce(
        {:ok, { bill_ids: [], total: 0 }},
        fn
          bill_id, {:ok, acc} ->
            {
              bill_ids: bill_ids,
              total: total
            } = acc

            bill_params = %{
              "id" => bill_id,
              "member_id" => member_id
            }

            case BillResolver.get_bill(bill_params) do
              %Bill{} = bill ->
                bill_amount = BillResolver.get_bill_total(bill)
                {:ok, 
                  {
                    bill_ids: [bill_id | bill_ids],
                    total: D.add(total, bill_amount)
                  }
                }

              _ ->
                payment_changeset =
                  %Payment{}
                  |> change_payment(params)
                  |> Changeset.add_error(:bill_ids, "Invalid bills")

                {:error, payment_changeset}
            end

          _bill_id, error ->
            error
        end
      )
    end)
    |> Multi.insert(:payment, fn %{bills_and_total: bills_and_total} ->
      params_with_total = Map.put(params, "amount", bills_and_total.total)

      Payment.save_changeset(%Payment{}, params_with_total)
    end)
    |> Multi.update_all(
      :pay_bills,
      fn %{payment: payment, bills_and_total: bills_and_total} ->
        import Ecto.Query

        Bill
        |> where([b], b.id in ^bills_and_total.bill_ids)
        |> update(set: [payment_id: ^payment.id])
      end,
      []
    )
    |> Repo.transaction()
  end

  def change_payment(%Payment{} = payment, params \\ %{}), do: Payment.changeset(payment, params)

  def count_payments(params \\ %{}) do
    params
    |> PQ.query_payment()
    |> Repo.aggregate(:count)
  end
end
