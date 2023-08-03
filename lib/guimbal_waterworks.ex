defmodule GuimbalWaterworks do
  @moduledoc """
  GuimbalWaterworks keeps the contexts that define your domain
  and business logic.

  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """

  def basic_queries do
    quote do
      defp query_by(query, %{"id" => id} = params) do
        query
        |> where([q], q.id == ^id)
        |> query_by(Map.delete(params, "id"))
      end

      defp query_by(query, %{"preload" => preload} = params) do
        query
        |> preload([q], ^preload)
        |> query_by(Map.delete(params, "preload"))
      end

      defp query_by(query, %{"limit" => limit} = params) do
        query
        |> limit(^limit)
        |> query_by(Map.delete(params, "limit"))
      end

      defp query_by(query, %{"order_by" => order_by} = params) do
        query
        |> order_by(^order_by)
        |> query_by(Map.delete(params, "order_by"))
      end
    end
  end

  def catch_query do
    quote do
      defp query_by(query, _params), do: query
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
