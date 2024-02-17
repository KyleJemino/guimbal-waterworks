defmodule GuimbalWaterworksWeb.UsersRegistrationView do
  use GuimbalWaterworksWeb, :view

  alias GuimbalWaterworks.Helpers
  alias GuimbalWaterworks.Accounts.Users

  def roles() do
    Users.roles()
    |> List.delete(:manager)
    |> Helpers.generate_options_from_atoms()
  end
end
