alias GuimbalWaterworks.Repo
alias GuimbalWaterworks.Helpers
alias GuimbalWaterworks.Constants
alias GuimbalWaterworks.Accounts.Users
alias GuimbalWaterworks.Members.Member
alias GuimbalWaterworks.Bills
alias GuimbalWaterworks.Bills.{
  Bill,
  BillingPeriod,
  Rate
}
alias GuimbalWaterworks.Accounts.Queries.UserQuery

superuser =
  %{"role" => :manager, "limit" => 1}
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
  Repo.all(Member)

# Create billing periods from march
current_month = Timex.now().month
months =
  if current_month > 6 do
    (current_month - 6)..current_month
  else
    1..current_month
  end

rate = Bills.get_rate(%{"limit" => 1})

billing_periods =
  Enum.map(months, fn x ->
    month = 
      x
      |> Timex.month_name()
      |> String.upcase()

    next_month = x + 1

    due_date =
      Date.new!(2023, next_month, 1)
      |> Date.end_of_month()

    from =
      Date.new!(2023, x, 1)

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
      death_aid_recipients: recipients,
      rate_id: rate.id
    }

    %BillingPeriod{}
    |> BillingPeriod.changeset(period_attrs)
    |> Repo.insert!()
  end)

# Create bills and payments
IO.puts "Creating bils and payments"
Enum.each(members, fn member ->
  bills =
    Enum.map(billing_periods, fn period ->
      reading = Enum.random(1..30)
      bill_attrs = %{
        before: 0,
        after: reading,
        reading: reading,
        membership_fee?: false,
        reconnection_fee?: false,
        member_id: member.id,
        billing_period_id: period.id,
        user_id: admin.id
      }

      %Bill{}
      |> Bill.changeset(bill_attrs)
      |> Repo.insert!()
    end)

  no_of_bills_to_pay = Enum.random(3..6)
  chunked_bills_to_pay = 
    bills
    |> Enum.take(no_of_bills_to_pay)
    |> Helpers.chunk_random()

  payments =
    Enum.map(chunked_bills_to_pay, fn bills ->
      bill_ids = 
        bills
        |> Enum.map(fn bill -> bill.id end)
        |> Enum.join(",")

      payment_attrs = %{
        "or" => Enum.random(0..1_000_000_000),
        "bill_ids" => bill_ids,
        "member_id" => member.id,
        "user_id" => cashier.id
      }

      {:ok, %{payment: payment}} = Bills.create_payment(payment_attrs)

      payment
    end)
end)
