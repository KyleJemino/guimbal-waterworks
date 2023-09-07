defmodule GuimbalWaterworks.Members.Queries.MemberQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Members.Member
  alias GuimbalWaterworks.Bills.Bill

  def query_member(params) do
    from(m in Member, as: :member)
    |> query_by(params)
  end

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

  defp query_by(query, %{"street" => "All"} = params) do
    query_by(query, Map.delete(params, "street"))
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
          |> where(
            [m],
            fragment(
              "EXISTS (SELECT * FROM bills b WHERE b.member_id = ? AND b.payment_id IS NULL)",
              m.id
            )
          )

        "with_no_unpaid" ->
          query
          |> where(
            [m],
            fragment(
              "NOT EXISTS (SELECT * FROM bills b WHERE b.member_id = ? AND b.payment_id IS NULL)",
              m.id
            )
          )

        "disconnection_warning" ->
          query
          |> where(
            [m],
            subquery(
              from(b in Bill,
                select: count(),
                where: parent_as(:member).id == b.member_id and is_nil(b.payment_id)
              )
            ) == 2
          )
          |> where([m], m.connected?)

        "for_disconnection" ->
          query
          |> where(
            [m],
            subquery(
              from(b in Bill,
                select: count(),
                where: parent_as(:member).id == b.member_id and is_nil(b.payment_id)
              )
            ) == 3
          )
          |> where([m], m.connected?)

        "for_reconnection" ->
          query
          |> where(
            [m],
            fragment(
              "NOT EXISTS (SELECT * FROM bills b WHERE b.member_id = ? AND b.payment_id IS NULL)",
              m.id
            )
          )
          |> where([m], not m.connected?)

        _ ->
          query
      end

    query_by(status_query, Map.delete(params, "status"))
  end

  use GuimbalWaterworks, :basic_queries
end
