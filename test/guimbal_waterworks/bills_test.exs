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
      valid_attrs = %{due_date: ~D[2023-08-06], from: ~D[2023-08-06], month: "some month", to: ~D[2023-08-06], year: "some year"}

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
      update_attrs = %{due_date: ~D[2023-08-07], from: ~D[2023-08-07], month: "some updated month", to: ~D[2023-08-07], year: "some updated year"}

      assert {:ok, %BillingPeriod{} = billing_period} = Bills.update_billing_period(billing_period, update_attrs)
      assert billing_period.due_date == ~D[2023-08-07]
      assert billing_period.from == ~D[2023-08-07]
      assert billing_period.month == "some updated month"
      assert billing_period.to == ~D[2023-08-07]
      assert billing_period.year == "some updated year"
    end

    test "update_billing_period/2 with invalid data returns error changeset" do
      billing_period = billing_period_fixture()
      assert {:error, %Ecto.Changeset{}} = Bills.update_billing_period(billing_period, @invalid_attrs)
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
end
