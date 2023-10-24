defmodule GuimbalWaterworks.Requests.Queries.RequestQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Requests.Request

  def query_request(params) do
    from(r in Request, as: :request)
    |> query_by(params)
  end

  defp query_by(query, %{"active?" => active?} = params) do
    final_query =
      if active? do
        where(query, [q], is_nil(q.archived_at) and is_nil(q.used_at))
      else
        where(query, [q], not is_nil(q.archived_at) or not is_nil(q.used_at))
      end

    query_by(final_query, Map.delete(params, "active?"))
  end

  use GuimbalWaterworks, :basic_queries
end
