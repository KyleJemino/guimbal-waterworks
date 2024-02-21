defmodule GuimbalWaterworks.Bills.Resolvers.BillingPeriodResolver do
  alias GuimbalWaterworks.Repo

  alias GuimbalWaterworks.Bills.BillingPeriod
  alias GuimbalWaterworks.Bills.Queries.BillingPeriodQuery, as: BPQ
  import Ecto.Query

  def get_billing_period(params \\ %{}) do
    params
    |> BPQ.query_billing_period()
    |> Repo.one()
  end

  def get_previous_billing_period(%BillingPeriod{due_date: due_date}) do
    BillingPeriod
    |> where([bp], bp.due_date < ^due_date)
    |> order_by(desc: :due_date)
    |> first()
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
