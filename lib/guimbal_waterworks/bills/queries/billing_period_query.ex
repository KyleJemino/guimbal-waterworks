defmodule GuimbalWaterworks.Bills.Queries.BillingPeriodQuery do
  import Ecto.Query

  alias GuimbalWaterworks.Bills.BillingPeriod
  alias GuimbalWaterworks.Bills.Bill

  def query_billing_period(params) do
    query_by(BillingPeriod, params)
  end

  use GuimbalWaterworks, :basic_queries

  defp query_by(query, %{"with_no_bill_for_member_id" => member_id} = params) do
    query
    |> join(:left,[bp], b in Bill, on: b.billing_period_id == bp.id and b.member_id == ^member_id)
    |> where([_bp, p], is_nil(p.id))
    |> query_by(Map.delete(params, "with_no_bill_for_member_id"))
  end

  use GuimbalWaterworks, :catch_query
end
