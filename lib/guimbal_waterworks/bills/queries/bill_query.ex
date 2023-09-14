defmodule GuimbalWaterworks.Bills.Queries.BillQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Bills.Bill

  def query_bill(params) do
    query_by(Bill, params)
  end

  defp query_by(query, %{"member_id" => member_id} = params) do
    query
    |> where([q], q.member_id == ^member_id)
    |> query_by(Map.delete(params, "member_id"))
  end

  defp query_by(query, %{"status" => :unpaid} = params) do
    query
    |> where([q], is_nil(q.payment_id))
    |> query_by(Map.delete(params, "status"))
  end

  defp query_by(query, %{"billing_period_id" => billing_period_id} = params) do
    query
    |> where([q], q.billing_period_id == ^billing_period_id)
    |> query_by(Map.delete(params, "billing_period_id"))
  end

  defp query_by(query, %{"order_by" => "billing_period_desc"} = params) do
    query
    |> join(:left, [q], bp in assoc(q, :billing_period))
    |> order_by([q, bp], desc: bp.due_date)
    |> query_by(Map.delete(params, "order_by"))
  end

  use GuimbalWaterworks, :basic_queries
end
