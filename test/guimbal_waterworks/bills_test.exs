defmodule GuimbalWaterworks.BillsTest do
  use GuimbalWaterworks.DataCase

  alias GuimbalWaterworks.Bills

  describe "billing_periods" do
    alias GuimbalWaterworks.Bills.BillingPeriod

    import GuimbalWaterworks.BillsFixtures

    @invalid_attrs %{due_date: nil, from: nil, month: nil, to: nil, year: nil}

    test "list_billing_periods/0 returns all billing_periods" do
      billing_period = billing_period_fixture()
      assert Bills.list_billing_periods() == [billing_period]
    end

    test "get_billing_period!/1 returns the billing_period with given id" do
      billing_period = billing_period_fixture()
      assert Bills.get_billing_period!(billing_period.id) == billing_period
    end

    test "create_billing_period/1 with valid data creates a billing_period" do
      valid_attrs = %{
        due_date: ~D[2023-08-06],
        from: ~D[2023-08-06],
        month: "some month",
        to: ~D[2023-08-06],
        year: "some year"
      }

      assert {:ok, %BillingPeriod{} = billing_period} = Bills.create_billing_period(valid_attrs)
      assert billing_period.due_date == ~D[2023-08-06]
      assert billing_period.from == ~D[2023-08-06]
      assert billing_period.month == "some month"
      assert billing_period.to == ~D[2023-08-06]
      assert billing_period.year == "some year"
    end

    test "create_billing_period/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Bills.create_billing_period(@invalid_attrs)
    end

    test "update_billing_period/2 with valid data updates the billing_period" do
      billing_period = billing_period_fixture()

      update_attrs = %{
        due_date: ~D[2023-08-07],
        from: ~D[2023-08-07],
        month: "some updated month",
        to: ~D[2023-08-07],
        year: "some updated year"
      }

      assert {:ok, %BillingPeriod{} = billing_period} =
               Bills.update_billing_period(billing_period, update_attrs)

      assert billing_period.due_date == ~D[2023-08-07]
      assert billing_period.from == ~D[2023-08-07]
      assert billing_period.month == "some updated month"
      assert billing_period.to == ~D[2023-08-07]
      assert billing_period.year == "some updated year"
    end

    test "update_billing_period/2 with invalid data returns error changeset" do
      billing_period = billing_period_fixture()

      assert {:error, %Ecto.Changeset{}} =
               Bills.update_billing_period(billing_period, @invalid_attrs)

      assert billing_period == Bills.get_billing_period!(billing_period.id)
    end

    test "delete_billing_period/1 deletes the billing_period" do
      billing_period = billing_period_fixture()
      assert {:ok, %BillingPeriod{}} = Bills.delete_billing_period(billing_period)
      assert_raise Ecto.NoResultsError, fn -> Bills.get_billing_period!(billing_period.id) end
    end

    test "change_billing_period/1 returns a billing_period changeset" do
      billing_period = billing_period_fixture()
      assert %Ecto.Changeset{} = Bills.change_billing_period(billing_period)
    end
  end

  describe "gcash_ref_no" do
    alias GuimbalWaterworks.Bills.Payment
    alias GuimbalWaterworks.Members
    alias GuimbalWaterworks.Repo

    import GuimbalWaterworks.AccountsFixtures

    setup do
      {:ok, member} =
        Members.create_member(%{
          first_name: "Juan",
          last_name: "Dela Cruz",
          unique_identifier: "1",
          street: "BALANTAD ST. (1)",
          type: :personal,
          connected?: true,
          mda?: false
        })

      %{member: member, user: users_fixture()}
    end

    defp insert_payment(%{member: member, user: user}, attrs) do
      %Payment{}
      |> Payment.save_changeset(
        Enum.into(attrs, %{
          member_id: member.id,
          user_id: user.id,
          bill_ids: Ecto.UUID.generate(),
          amount: Decimal.new("100.00")
        })
      )
      |> Repo.insert()
    end

    test "allows multiple payments without a gcash_ref_no", ctx do
      assert {:ok, %{gcash_ref_no: nil}} = insert_payment(ctx, %{or: "1"})
      assert {:ok, %{gcash_ref_no: nil}} = insert_payment(ctx, %{or: "2", gcash_ref_no: ""})
    end

    test "does not allow multiple payments with the same gcash_ref_no on create", ctx do
      assert {:ok, _payment} = insert_payment(ctx, %{or: "1", gcash_ref_no: "123"})
      assert {:error, changeset} = insert_payment(ctx, %{or: "2", gcash_ref_no: "123"})
      assert %{gcash_ref_no: ["Gcash reference no. already exists."]} = errors_on(changeset)
    end

    test "does not allow editing a payment to an existing gcash_ref_no", ctx do
      assert {:ok, _payment} = insert_payment(ctx, %{or: "1", gcash_ref_no: "123"})
      assert {:ok, payment} = insert_payment(ctx, %{or: "2"})

      assert {:error, changeset} = Bills.edit_payment(payment, %{gcash_ref_no: "123"})
      assert %{gcash_ref_no: ["Gcash reference no. already exists."]} = errors_on(changeset)
    end
  end
end
