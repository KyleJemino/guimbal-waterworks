defmodule GuimbalWaterworksWeb.DisplayHelpers do
  alias GuimbalWaterworks.Accounts.Users

  def full_name(%Users{
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name
      }) do
    "#{last_name}, #{first_name}#{if not is_nil(middle_name), do: ", #{middle_name}"}"
  end
end
