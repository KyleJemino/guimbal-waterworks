defmodule GuimbalWaterworks.RecordCache do
  use Agent

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.BillingPeriod

  def start_link(_opts) do
    Agent.start_link(fn -> %{} end)
  end

  def get_record(cache, schema, record_id) do
    case fetch_from_server(cache, schema, record_id) do
      record when not is_nil(record) -> record
      _ ->
        add_record(cache, schema, record_id)
    end
  end

  def stop(cache), do: Agent.stop(cache)

  defp fetch_from_server(cache, schema, record_id) do
    Agent.get(agent,
      fn state ->
        with 
          record_key <- schema_to_key(schema),
          schema_store when not is_nil(schema_store) <- Map.get(state, record_key),
          record when not is_nil(record) <- Map.get(schema_store, record_id) do
            record
        else
          nil
        end
      end
    )
  end

  defp add_record(cache, schema, record_id) do
    record = fetch_record_from_db(schema, record_id) 
    record_key = schema_to_key(schema)

    Agent.get_and_update(cache, fn state ->
      default_schema_store_value = Map.put(%{}, record_id, record)

      updated_state = 
        Map.update(state, record_key, default_schema_store_value,
          fn existing_schema_store ->
            Map.put(existing_schema_store, record_id, record)
          end
        )

      {record, updated_state}
    end)
  end

  defp schema_to_key(schema) do
    case schema do
      Rate -> :rate
      BillingPeriod -> :billing_period
      _ -> raise :invalid_schema
    end
  end

  defp fetch_record_from_db(schema, record_id) do
    id_param = %{"id" => record_id}

    case schema do
      BillingPeriod ->
        Bills.get_billing_period!(id_param)
      Rate ->
        Bills.get_rate!(id_param)
      _ ->
        raise :invalid_schema
    end
  end
end
