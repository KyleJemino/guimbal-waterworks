defmodule GuimbalWaterworks.Helpers do
  def db_now(), do: DateTime.utc_now() |> DateTime.truncate(:second)
end
