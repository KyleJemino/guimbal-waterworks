defmodule GuimbalWaterworksWeb.DisplayHelpers do
  alias Decimal, as: D

  alias GuimbalWaterworks.Accounts.Users
  alias GuimbalWaterworks.Members.Member

  def full_name(%Users{
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name
      }) do
    "#{last_name}, #{first_name}#{if not is_nil(middle_name), do: ", #{middle_name}"}"
  end

  def full_name(%Member{
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        unique_identifier: identifier
      }) do
    middle_initial_part =
      if not is_nil(middle_name) do
        abbreviation =
          middle_name
          |> String.first()
          |> String.capitalize()

        ", #{abbreviation}."
      else
        ""
      end

    formatted_name = "#{last_name}, #{first_name}#{middle_initial_part}"

    "#{formatted_name}#{if not is_nil(identifier), do: " (#{identifier})"}"
  end

  def format_date(date), do: Timex.format!(date, "%b %d %Y", :strftime)
  def format_date(date, format), do: Timex.format!(date, format, :strftime)

  def money(float) when is_float(float) do
    amount =
      float
      |> Decimal.from_float()
      |> D.round(2)
      |> Number.Delimit.number_to_delimited()

    "₱#{amount}"
  end

  def money(decimal) do
    amount =
      decimal
      |> D.round(2)
      |> Number.Delimit.number_to_delimited()

    "₱#{amount}"
  end

  def display_period(billing_period), do: "#{billing_period.month} #{billing_period.year}"

  def display_abbreviated_period(%{month: month, year: year}) do
    "#{String.slice(month, 0..2)} #{year}"
  end

  def status_color(status) do
    case status do
      "Updated Payments" -> "green"
      "For Reconnection" -> "blue"
      "With 1 Unpaid" -> "yellow"
      "Disconnection Warning" -> "orange"
      _x -> "red"
    end
  end

  def active_class?(for_actions, current_action) do
    if current_action in for_actions do
      " -active"
    else
      ""
    end
  end

  def month_list(months) do
    Enum.reduce(months, "", fn month, acc ->
      shortened = binary_part(month, 0, 3)

      case acc do
        "" -> shortened
        _ -> "#{acc}/#{shortened}"
      end
    end)
  end

  def percent(rate) do
    percent =
      rate
      |> Decimal.mult("100")
      |> Decimal.to_string()

    "#{percent}%"
  end
end
