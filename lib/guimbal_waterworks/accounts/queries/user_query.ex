defmodule GuimbalWaterworks.Accounts.Queries.UserQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Accounts.Users

  def query_user(params) do
    query_by(Users, params)
  end

  defp query_by(query, %{"role" => role} = params) do
    query
    |> where([q], q.role == ^role)
    |> query_by(Map.delete(params, "role"))
  end

  use GuimbalWaterworks, :basic_queries

  use GuimbalWaterworks, :catch_query
end
