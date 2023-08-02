defmodule GuimbalWaterworks.Accounts.Queries.UserQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Accounts.Users

  def query_user(params) do
    query_by(Users, params)
  end

  use GuimbalWaterworks, :basic_queries
  #insert custom queries here

  use GuimbalWaterworks, :catch_query
end
