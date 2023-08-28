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

  def money(decimal), do: "PHP #{D.round(decimal, 2)}"

  def display_period(billing_period), do: "#{billing_period.month} #{billing_period.year}"
end
