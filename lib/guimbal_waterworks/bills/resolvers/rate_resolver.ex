defmodule GuimbalWaterworks.Bills.Resolvers.RateResolver do
  alias GuimbalWaterworks.Bills.Rate
  alias GuimbalWaterworks.Repo

  def create_rate(attrs \\ %{}) do
    %Rate{}
    |> Rate.changeset(attrs)
    |> Repo.insert()
  end

  def rate_changeset(%Rate{} = rate, attrs \\ %{}), do: Rate.changeset(rate, attrs)
end
