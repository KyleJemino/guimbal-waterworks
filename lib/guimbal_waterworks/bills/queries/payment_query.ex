defmodule GuimbalWaterworks.Bills.Queries.PaymentQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Bills.Payment

  def query_payment(params) do
    Payment
    |> join(:left, [q], m in assoc(q, :member), as: :member)
    |> query_by(params)
  end

  defp query_by(query, %{"member_id" => member_id} = params) do
    query
    |> where([q], q.member_id == ^member_id)
    |> query_by(Map.delete(params, "member_id"))
  end

  defp query_by(query, %{"paid_from" => paid_at} = params) do
    query
    |> where([q], q.paid_at > ^paid_at)
    |> query_by(Map.delete(params, "paid_from"))
  end

  defp query_by(query, %{"paid_to" => paid_at} = params) do
    query
    |> where([q], q.paid_at < ^paid_at)
    |> query_by(Map.delete(params, "paid_to"))
  end

  defp query_by(query, %{"last_name" => last_name} = params) do
    last_name_query = "%#{last_name}%"

    query
    |> where([_q, member: m], ilike(m.last_name, ^last_name_query))
    |> query_by(Map.delete(params, "last_name"))
  end

  defp query_by(query, %{"first_name" => first_name} = params) do
    first_name_query = "%#{first_name}%"

    query
    |> where([_q, member: m], ilike(m.first_name, ^first_name_query))
    |> query_by(Map.delete(params, "first_name"))
  end

  defp query_by(query, %{"middle_name" => middle_name} = params) do
    middle_name_query = "%#{middle_name}%"

    query
    |> where([_q, member: m], ilike(m.middle_name, ^middle_name_query))
    |> query_by(Map.delete(params, "middle_name"))
  end

  defp query_by(query, %{"street" => "All"} = params) do
    query_by(query, Map.delete(params, "street"))
  end

  defp query_by(query, %{"street" => street} = params) do
    query
    |> where([_q, member: m], m.street == ^street)
    |> query_by(Map.delete(params, "street"))
  end

  defp query_by(query, %{"type" => type} = params) when type in ["personal", "business"] do
    query
    |> where([_q, member: m], m.type == ^type)
    |> query_by(Map.delete(params, "type"))
  end

  use GuimbalWaterworks, :basic_queries
end
