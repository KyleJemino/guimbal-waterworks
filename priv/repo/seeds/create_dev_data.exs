alias GuimbalWaterworks.Repo
alias GuimbalWaterworks.Helpers
alias GuimbalWaterworks.Constants
alias GuimbalWaterworks.Accounts.Users
alias GuimbalWaterworks.Members.Member
alias GuimbalWaterworks.Bills.BillingPeriod
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

feb_index = 1

# Create billing periods from march
billing_periods =
  Enum.map(1..6, fn x ->
    month = Enum.at(Constants.months, 1 + x)

    current_month_number = 1 + x + 1

    due_date =
      Date.new!(2023, current_month_number, 1)
      |> Date.end_of_month()

    from =
      Date.new!(2023, current_month_number - 1, 1)

    to = Date.end_of_month(from)

    recipient_count = Enum.random(0..3)

    recipients = 
      if recipient_count > 0 do
        Enum.map(0..recipient_count, fn _x -> 
          %{name: Faker.Name.name()}
        end)
      else
        []
      end

    period_attrs = %{
      month: month,
      year: "2023",
      due_date: due_date,
      from: from,
      to: to,
      personal_rate: 0.18,
      business_rate: 0.15,
      franchise_tax_rate: 0.02,
      death_aid_recipients: recipients
    }

    %BillingPeriod{}
    |> BillingPeriod.changeset(period_attrs)
    |> Repo.insert!()
  end)
