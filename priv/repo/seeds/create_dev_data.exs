alias GuimbalWaterworks.Repo
alias GuimbalWaterworks.Helpers
alias GuimbalWaterworks.Accounts.Users
alias GuimbalWaterworks.Members.Member
alias GuimbalWaterworks.Accounts.Queries.UserQuery

superuser =
  %{"role" => :manager}
  |> UserQuery.query_user()
  |> Repo.one()

# Create users
admin_attrs = %{
  username: "adminuser",
  first_name: "Admin",
  middle_name: nil,
  last_name: "User",
  role: :admin,
  password: "password1234",
  password_confirmation: "password1234",
  approved_at: Helpers.db_now()
}

admin = 
  %Users{}
  |> Users.super_changeset(admin_attrs)
  |> Repo.insert!()

cashier_attrs = %{
  username: "cashieruser",
  first_name: "Cashier",
  middle_name: nil,
  last_name: "User",
  role: :cashier,
  password: "password1234",
  password_confirmation: "password1234",
  approved_at: Helpers.db_now()
}

cashier =
  %Users{}
  |> Users.super_changeset(cashier_attrs)
  |> Repo.insert!()

# Create members
members =
  Enum.map(1..100, fn x ->
    type = if (Enum.random(0..100) > 5), do: :personal, else: :business 

    user_attrs = %{
      first_name: Faker.Name.first_name(),
      middle_name: Faker.Name.last_name(),
      last_name: Faker.Name.last_name(),
      unique_identifier: nil,
      street: Faker.Address.street_name(),
      meter_no: x,
      type: type,
      connected?: true,
      mda?: Enum.random(0..100) > 10
    }

    %Member{} 
    |> Member.changeset(user_attrs)
    |> Repo.insert!()
  end)
