defmodule GuimbalWaterworks.Bills.Resolvers.RateResolver do
  alias GuimbalWaterworks.Repo
  alias GuimbalWaterworks.Bills.Rate
  alias GuimbalWaterworks.Bills.Queries.RateQuery, as: RQ

  def list_rates(params \\ %{}) do
    params
    |> RQ.query_rate()
    |> Repo.all()
  end

  def get_rate(params \\ %{}) do
    params
    |> RQ.query_rate()
    |> Repo.one()
  end

  def create_rate(attrs \\ %{}) do
    %Rate{}
    |> Rate.changeset(attrs)
    |> Repo.insert()
  end

  def rate_changeset(%Rate{} = rate, attrs \\ %{}), do: Rate.changeset(rate, attrs)
end
