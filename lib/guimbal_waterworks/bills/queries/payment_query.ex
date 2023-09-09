defmodule GuimbalWaterworks.Bills.Queries.PaymentQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Bills.Payment

  def query_payment(params) do
    query_by(Payment, params)
  end

  defp query_by(query, %{"member_id" => member_id} = params) do
    query
    |> where([q], q.member_id == ^member_id)
    |> query_by(Map.delete(params, "member_id"))
  end

  use GuimbalWaterworks, :basic_queries
end
