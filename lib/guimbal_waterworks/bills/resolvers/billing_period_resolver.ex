defmodule GuimbalWaterworks.Bills.Resolvers.BillingPeriodResolver do
  alias GuimbalWaterworks.Repo

  alias GuimbalWaterworks.Bills.BillingPeriod
  alias GuimbalWaterworks.Bills.Queries.BillingPeriodQuery, as: BPQ

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
      personal_rate: 18.06,
      business_rate: 17.06,
      franchise_tax_rate: 0.02,
      year: year_string
    }
  end
end
