defmodule GuimbalWaterworks.Bills.Resolvers.PaymentResolver do
  alias GuimbalWaterworks.Repo
  alias Ecto.Multi
  alias Ecto.Changeset

  alias GuimbalWaterworks.Bills.{
    Payment,
    Bill
  }

  alias GuimbalWaterworks.Bills.Resolvers.BillResolver

  def create_payment(%{"bill_ids" => bill_ids_string} = params) do
    Multi.new()
    |> Multi.insert(:payment, change_payment(%Payment{}, params))
    |> Multi.run(:check_member_bills, fn _repo, %{payment: payment} ->
      bill_ids_string
      |> String.split(",")
      |> Enum.reduce(
        {:ok, []},
        fn
          bill_id, {:ok, list} ->
            bill_params = %{
              "id" => bill_id,
              "member_id" => payment.member_id
            }

            case BillResolver.get_bill(bill_params) do
              %Bill{} ->
                {:ok, [bill_id | list]}

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
    |> Multi.update_all(
      :pay_bills,
      fn %{payment: payment, check_member_bills: validated_bill_ids} ->
        import Ecto.Query

        Bill
        |> where([b], b.id in ^validated_bill_ids)
        |> update(set: [payment_id: ^payment.id])
      end,
      []
    )
    |> Repo.transaction()
  end

  def change_payment(%Payment{} = payment, params \\ %{}), do: Payment.changeset(payment, params)
end
