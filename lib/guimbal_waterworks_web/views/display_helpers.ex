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

  def money(decimal) do
    amount =
      decimal
      |> D.round(2)
      |> Number.Delimit.number_to_delimited()

    "₱#{amount}"
  end

  def display_period(billing_period), do: "#{billing_period.month} #{billing_period.year}"

  def member_status(unpaid_period_amount_map, true = _connected?) do
    case Enum.count(unpaid_period_amount_map) do
      0 -> "With No Unpaid"
      1 -> "With 1 Unpaid"
      2 -> "Disconnection Warning"
      3 -> "For Disconnection"
    end
  end

  def member_status(unpaid_period_amount_map, false = _connected?) do
    if Enum.count(unpaid_period_amount_map) < 2 do
      "For Reconnection"
    else
      "Disconnected"
    end
  end

  def status_color(status) do
    case status do
      "With No Unpaid" -> "green"
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
end
