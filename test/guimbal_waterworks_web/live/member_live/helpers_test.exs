defmodule GuimbalWaterworksWeb.MemberLive.HelpersTest do
  use ExUnit.Case, async: true

  alias GuimbalWaterworks.Bills.{Bill, BillingPeriod}
  alias GuimbalWaterworksWeb.MemberLive.Helpers

  defp bill_due_in(days, payment_id \\ nil) do
    %Bill{
      payment_id: payment_id,
      billing_period: %BillingPeriod{due_date: Date.add(Date.utc_today(), days)}
    }
  end

  describe "any_overdue_bills?/1" do
    test "returns false for an empty list" do
      refute Helpers.any_overdue_bills?([])
    end

    test "returns false when all unpaid bills are due today or later" do
      refute Helpers.any_overdue_bills?([bill_due_in(0), bill_due_in(5)])
    end

    test "returns true when an unpaid bill is past its due date" do
      assert Helpers.any_overdue_bills?([bill_due_in(5), bill_due_in(-1)])
    end

    test "ignores paid bills past their due date" do
      refute Helpers.any_overdue_bills?([bill_due_in(-30, 1), bill_due_in(5)])
    end
  end
end
