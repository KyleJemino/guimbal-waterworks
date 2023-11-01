defmodule GuimbalWaterworks.Bills.Queries.RateQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Bills.Rate

  def query_rate(params) do
    query_by(Rate, params)
  end

  defp query_by(query, %{"order_by" => "default"} = params) do
    query
    |> order_by([q], [desc: q.inserted_at])
    |> query_by(Map.delete(params, "order_by"))
  end

  use GuimbalWaterworks, :basic_queries
end
