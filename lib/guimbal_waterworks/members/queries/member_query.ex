defmodule GuimbalWaterworks.Members.Queries.MemberQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Members.Member
  alias GuimbalWaterworks.Bills.Bill

  def query_member(params) do
    query_by(Member, params)
  end

  use GuimbalWaterworks, :basic_queries
  # insert custom queries here

  defp query_by(query, %{"last_name" => last_name} = params) do
    last_name_query = "%#{last_name}%"

    query
    |> where([q], ilike(q.last_name, ^last_name_query))
    |> query_by(Map.delete(params, "last_name"))
  end

  defp query_by(query, %{"first_name" => first_name} = params) do
    first_name_query = "%#{first_name}%"

    query
    |> where([q], ilike(q.first_name, ^first_name_query))
    |> query_by(Map.delete(params, "first_name"))
  end

  defp query_by(query, %{"middle_name" => middle_name} = params) do
    middle_name_query = "%#{middle_name}%"

    query
    |> where([q], ilike(q.middle_name, ^middle_name_query))
    |> query_by(Map.delete(params, "middle_name"))
  end

  defp query_by(query, %{"street" => street} = params) do
    query
    |> where([q], q.street == ^street)
    |> query_by(Map.delete(params, "street"))
  end

  defp query_by(query, %{"type" => type} = params) when type in ["personal", "business"] do
    query
    |> where([q], q.type == ^type)
    |> query_by(Map.delete(params, "type"))
  end

  defp query_by(query, %{"status" => status} = params) do
    status_query =
      case status do
        "connected" ->
          query
          |> where([q], q.connected?)

        "disconnected" ->
          query
          |> where([q], not q.connected?)

        "with_unpaid" ->
          query
          |> join(:inner, [m], b in Bill, on: b.member_id == m.id)
          |> where([m, b], is_nil(b.payment_id))
          |> group_by([m], m.id)

        _ ->
          query
      end

    query_by(status_query, Map.delete(params, "status"))
  end

  use GuimbalWaterworks, :catch_query
end
