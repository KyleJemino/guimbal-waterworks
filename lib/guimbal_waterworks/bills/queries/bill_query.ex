defmodule GuimbalWaterworks.Bills.Queries.BillQuery do
  import Ecto.Query
  alias GuimbalWaterworks.Bills.Bill

  def query_bill(params) do
    Bill
    |> join(:left, [q], bp in assoc(q, :billing_period), as: :billing_period)
    |> join(:left, [q], m in assoc(q, :member), as: :member)
    |> query_by(params)
  end

  defp query_by(query, %{"member_id" => member_id} = params) do
    query
    |> where([q], q.member_id == ^member_id)
    |> query_by(Map.delete(params, "member_id"))
  end

  defp query_by(query, %{"billing_period_id" => billing_period_id} = params) do
    query
    |> where([q], q.billing_period_id == ^billing_period_id)
    |> query_by(Map.delete(params, "billing_period_id"))
  end

  defp query_by(query, %{"order_by" => "default"} = params) do
    query
    |> order_by([q, billing_period: bp, member: m],
      desc: bp.due_date,
      asc: m.last_name,
      asc: m.first_name,
      asc: m.last_name,
      asc: m.unique_identifier
    )
    |> query_by(Map.delete(params, "order_by"))
  end

  defp query_by(query, %{"order_by" => "oldest_first"} = params) do
    query
    |> order_by([q, billing_period: bp, member: m],
      asc: bp.due_date,
      asc: m.last_name,
      asc: m.first_name,
      asc: m.last_name,
      asc: m.unique_identifier
    )
    |> query_by(Map.delete(params, "order_by"))
  end

  defp query_by(query, %{"due_from" => due_date} = params) do
    query
    |> where([q, billing_period: bp], bp.due_date > ^due_date)
    |> query_by(Map.delete(params, "due_from"))
  end

  defp query_by(query, %{"due_to" => due_date} = params) do
    query
    |> where([q, billing_period: bp], bp.due_date < ^due_date)
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

  defp query_by(
         query,
         %{
           "last_member_bill_before" => %{"member_id" => member_id, "before_date" => before_date}
         } = params
       ) do
    query
    |> where([q], q.member_id == ^member_id)
    |> where([_q, billing_period: bp], bp.due_date < ^before_date)
    |> order_by([_q, billing_period: bp], desc: bp.due_date)
    |> first()
    |> query_by(Map.delete(params, "last_member_bill_before"))
  end

  defp query_by(query, %{"type" => type} = params) when type in ["personal", "business"] do
    query
    |> where([_q, member: m], m.type == ^type)
    |> query_by(Map.delete(params, "type"))
  end

  defp query_by(query, %{"year" => year} = params) do
    query
    |> where([_q, billing_period: bp], bp.year == ^year)
    |> query_by(Map.delete(params, "year"))
  end

  defp query_by(query, %{"years" => years} = params) do
    query
    |> where([_q, billing_period: bp], bp.year in ^years)
    |> query_by(Map.delete(params, "years"))
  end

  use GuimbalWaterworks, :basic_queries
end
