defmodule GuimbalWaterworks.Constants do
  @months Enum.map(
      1..12,
      fn x ->
        x
        |> Timex.month_name()
        |> String.upcase()
      end
    )

  @streets [
    "BALANTAD ST. (1)",
    "BALANTAD ST. (2)",
    "BALANTAD ST. (3)",
    "BLUMENTRITT ST.",
    "BURGOS ST.",
    "C.COLON ST.",
    "C.FRUTO ST.",
    "GARBANZOS ST.",
    "GARGARITANO ST.",
    "GARIEL ST.",
    "GENEROSA ST.",
    "GENGOS ST.",
    "GERONA ST.",
    "GIMENO ST.",
    "GIRADO ST.",
    "GONZALES ST.",
    "GOTERA ST.",
    "GRANADA EXT.",
    "GRANADA ST.",
    "IGCOCOLO EXT. (1)",
    "IGCOCOLO EXT. (2)",
    "IGCOCOLO MAIN",
    "LIBO-ON ST.",
    "MAGSAYSAY ST.",
    "PESCADORES ST.",
    "PUBLIC MARKET",
    "RIZAL ST.",
    "RIZAL-TUGUISAN ST.",
    "SPECIAL BILLING",
    "TORREBLANCA ST."
  ]

  def months, do: @months
  def streets, do: @streets
end
