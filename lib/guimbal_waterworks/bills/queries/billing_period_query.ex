defmodule GuimbalWaterworks.Bills.Queries.BillingPeriodQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Bills.BillingPeriod

  def query_billing_period(params) do
    query_by(BillingPeriod, params)
  end

  use GuimbalWaterworks, :basic_queries

  use GuimbalWaterworks, :catch_query
end
