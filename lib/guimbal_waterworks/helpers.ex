defmodule GuimbalWaterworks.Helpers do
  def db_now(), do: DateTime.utc_now() |> DateTime.truncate(:second)

  def chunk_random(list) do
    count = Enum.count(list)
    final_index = count - 1

    Enum.reduce(list, {[[]], Enum.random(0..final_index), 0}, fn el, acc ->
      case acc do
        {
          [current_chunk | prev_chunks],
          _index_to_chunk,
          current_index
        }
        when current_index == final_index ->
          final_chunk = Enum.reverse([el | current_chunk])
          Enum.reverse([final_chunk | prev_chunks])

        {
          [current_chunk | prev_chunks],
          index_to_chunk,
          current_index
        }
        when current_index == index_to_chunk ->
          next_index = current_index + 1

          {
            [
              []
              | [
                  Enum.reverse([el | current_chunk])
                  | prev_chunks
                ]
            ],
            Enum.random(next_index..final_index),
            current_index + 1
          }

        {
          [current_chunk | prev_chunks],
          index_to_chunk,
          current_index
        } ->
          {
            [[el | current_chunk] | prev_chunks],
            index_to_chunk,
            current_index + 1
          }
      end
    end)
  end

  def remove_empty_map_values(map) do
    map
    |> Enum.filter(fn {_key, value} ->
      not is_nil(value) and value !== ""
    end)
    |> Map.new()
  end
end
