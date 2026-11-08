defmodule GuimbalWaterworks.BillsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `GuimbalWaterworks.Bills` context.
  """

  @doc """
  Generate a rate.
  """
  def rate_fixture(attrs \\ %{}) do
    {:ok, rate} =
      attrs
      |> Enum.into(%{
        title: "rate#{System.unique_integer([:positive])}",
        reconnection_fees: [Decimal.new("100.00")],
        discount_rates: [Decimal.new("0.05")],
        membership_fee: Decimal.new("50.00"),
        surcharge_fee: Decimal.new("0.10"),
        tax_rate: Decimal.new("0.02"),
        personal_prices: %{"10" => "100.00"},
        business_rate: Decimal.new("20.00")
      })
      |> GuimbalWaterworks.Bills.create_rate()

    rate
  end

  @doc """
  Generate a billing_period.
  """
  def billing_period_fixture(attrs \\ %{}) do
    {:ok, billing_period} =
      attrs
      |> Enum.into(%{
        due_date: ~D[2023-08-06],
        from: ~D[2023-08-06],
        month: "AUGUST",
        to: ~D[2023-08-06],
        year: "2023"
      })
      |> Map.put_new_lazy(:rate_id, fn -> rate_fixture().id end)
      |> GuimbalWaterworks.Bills.create_billing_period()

    billing_period
  end
end
