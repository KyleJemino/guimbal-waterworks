defmodule GuimbalWaterworks.Bills.Resolvers.BillingPeriodResolver do
  alias GuimbalWaterworks.Bills.BillingPeriod

  def new_billing_period() do
    year_string =
      Date.utc_today().year
      |> Integer.to_string()

    %BillingPeriod{
      personal_rate: 0.02,
      business_rate: 0.02,
      year: year_string
    }
  end
end
