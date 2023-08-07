defmodule GuimbalWaterworks.BillsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `GuimbalWaterworks.Bills` context.
  """

  @doc """
  Generate a billing_period.
  """
  def billing_period_fixture(attrs \\ %{}) do
    {:ok, billing_period} =
      attrs
      |> Enum.into(%{
        due_date: ~D[2023-08-06],
        from: ~D[2023-08-06],
        month: "some month",
        to: ~D[2023-08-06],
        year: "some year"
      })
      |> GuimbalWaterworks.Bills.create_billing_period()

    billing_period
  end
end
