defmodule GuimbalWaterworks.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `GuimbalWaterworks.Accounts` context.
  """

  def unique_users_email, do: "users#{System.unique_integer()}@example.com"
  def valid_users_password, do: "hello world!"

  def valid_users_attributes(attrs \\ %{}) do
    Enum.into(attrs, %{
      email: unique_users_email(),
      password: valid_users_password()
    })
  end

  def users_fixture(attrs \\ %{}) do
    {:ok, users} =
      attrs
      |> valid_users_attributes()
      |> GuimbalWaterworks.Accounts.register_users()

    users
  end

  def extract_users_token(fun) do
    {:ok, captured_email} = fun.(&"[TOKEN]#{&1}[TOKEN]")
    [_, token | _] = String.split(captured_email.text_body, "[TOKEN]")
    token
  end
end
