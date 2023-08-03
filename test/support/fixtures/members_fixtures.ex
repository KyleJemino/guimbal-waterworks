defmodule GuimbalWaterworks.MembersFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `GuimbalWaterworks.Members` context.
  """

  @doc """
  Generate a member.
  """
  def member_fixture(attrs \\ %{}) do
    {:ok, member} =
      attrs
      |> Enum.into(%{
        first_name: "some first_name",
        last_name: "some last_name",
        meter_no: 42,
        middle_name: "some middle_name",
        street: "some street",
        type: "some type",
        unique_identifier: "some unique_identifier"
      })
      |> GuimbalWaterworks.Members.create_member()

    member
  end
end
