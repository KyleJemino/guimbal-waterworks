defmodule GuimbalWaterworks.Members.Queries.MemberQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Members.Member

  def query_member(params) do
    query_by(Member, params)
  end

  use GuimbalWaterworks, :basic_queries
  # insert custom queries here

  use GuimbalWaterworks, :catch_query
end
