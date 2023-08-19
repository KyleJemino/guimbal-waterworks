defmodule GuimbalWaterworks.Bills.Resolvers.PaymentResolver do
  alias GuimbalWaterworks.Repo
  alias Ecto.Multi
  alias GuimbalWaterworks.Bills.{
    Payment,
    Bill
  }

  def create_payment(%{"bill_ids" => bill_ids} = params) do
    import Ecto.Query

    Multi.new()
    |> Multi.insert(:payment, change_payment(%Payment{}, params))
    |> Multi.update_all(:pay_bills, fn %{payment: payment} ->
      Bill    
      |> where([b], b.id in ^bill_ids)
      |> update(set: [payment_id: ^payment.id])
    end, [])
    |> Repo.transaction()
  end

  def change_payment(%Payment{} = payment, params), do: Payment.changeset(payment, params)
end
