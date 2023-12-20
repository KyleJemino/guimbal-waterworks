defmodule GuimbalWaterworks.Bills.Resolvers.BillingPeriodResolver do
  alias GuimbalWaterworks.Repo

  alias GuimbalWaterworks.Bills.BillingPeriod
  alias GuimbalWaterworks.Bills.Queries.BillingPeriodQuery, as: BPQ

  def get_billing_period(params \\ %{}) do
    params
    |> BPQ.query_billing_period()
    |> Repo.one()
  end

  def list_billing_periods(params \\ %{}) do
    params
    |> BPQ.query_billing_period()
    |> Repo.all()
  end

  def new_billing_period() do
    year_string =
      Date.utc_today().year
      |> Integer.to_string()

    %BillingPeriod{
      year: year_string
    }
  end
end
