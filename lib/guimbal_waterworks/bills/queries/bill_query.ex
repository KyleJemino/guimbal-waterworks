defmodule GuimbalWaterworks.Bills.Queries.BillQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Bills.Bill

  def query_bill(params) do
    query_by(Bill, params)
  end

  use GuimbalWaterworks, :basic_queries

  use GuimbalWaterworks, :catch_query
end
