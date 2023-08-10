defmodule GuimbalWaterworks.Constants do
  def months do
    Enum.map(
      1..12,
      fn x ->
        x
        |> Timex.month_name()
        |> String.upcase()
      end
    )
  end
end
