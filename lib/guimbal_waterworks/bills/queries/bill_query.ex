defmodule GuimbalWaterworks.Bills.Queries.BillQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Bills.Bill

  def query_bill(params) do
    query_by(Bill, params)
  end

  defp query_by(query, %{"member_id" => member_id} = params) do
    query
    |> where([q], q.member_id == ^member_id)
    |> query_by(Map.delete(params, "member_id"))
  end

  defp query_by(query, %{"status" => :unpaid} = params) do
    query
    |> where([q], is_nil(q.payment_id))
    |> query_by(Map.delete(params, "status"))
  end

  defp query_by(query, %{"billing_period_id" => billing_period_id} = params) do
    query
    |> where([q], q.billing_period_id == ^billing_period_id)
    |> query_by(Map.delete(params, "billing_period_id"))
  end

  defp query_by(query, %{"order_by" => "billing_period_desc"} = params) do
    query
    |> join(:left, [q], bp in assoc(q, :billing_period))
    |> order_by([q, bp], desc: bp.due_date)
    |> query_by(Map.delete(params, "order_by"))
  end

  defp query_by(query, %{"due_from" => due_date} = params) do
    query
    |> join(:left, [q], bp in assoc(q, :billing_period))
    |> where([q, bp], bp.due_date > ^due_date)
    |> query_by(Map.delete(params, "due_from"))
  end

  defp query_by(query, %{"due_to" => due_date} = params) do
    query
    |> join(:left, [q], bp in assoc(q, :billing_period))
    |> where([q, bp], bp.due_date < ^due_date)
    |> query_by(Map.delete(params, "due_to"))
  end

  defp query_by(query, %{"status" => status} = params) do
    status_query =
      case status do
        "unpaid" ->
          query
          |> where([q], is_nil(q.payment_id))
        "paid" ->
          query
          |> where([q], not is_nil(q.payment_id))
        _ ->
          query
      end

    query_by(status_query, Map.delete(params, "status"))
  end

  defp query_by(query, %{"last_name" => last_name} = params) do
    last_name_query = "%#{last_name}%"

    query
    |> join(:left, [q], m in assoc(q, :member), as: :member)
    |> where([_q, member: m], ilike(m.last_name, ^last_name_query))
    |> query_by(Map.delete(params, "last_name"))
  end

  defp query_by(query, %{"first_name" => first_name} = params) do
    first_name_query = "%#{first_name}%"

    query
    |> join(:left, [q], m in assoc(q, :member), as: :member)
    |> where([_q, member: m], ilike(m.first_name, ^first_name_query))
    |> query_by(Map.delete(params, "first_name"))
  end

  defp query_by(query, %{"middle_name" => middle_name} = params) do
    middle_name_query = "%#{middle_name}%"

    query
    |> join(:left, [q], m in assoc(q, :member), as: :member)
    |> where([_q, member: m], ilike(m.middle_name, ^middle_name_query))
    |> query_by(Map.delete(params, "middle_name"))
  end

  defp query_by(query, %{"street" => "All"} = params) do
    query_by(query, Map.delete(params, "street"))
  end

  defp query_by(query, %{"street" => street} = params) do
    query
    |> join(:left, [q], m in assoc(q, :member), as: :member)
    |> where([_q, member: m], m.street == ^street)
    |> query_by(Map.delete(params, "street"))
  end

  defp query_by(query, %{"type" => type} = params) when type in ["personal", "business"] do
    query
    |> join(:left, [q], m in assoc(q, :member), as: :member)
    |> where([_q, member: m], m.type == ^type)
    |> query_by(Map.delete(params, "type"))
  end

  use GuimbalWaterworks, :basic_queries
end
