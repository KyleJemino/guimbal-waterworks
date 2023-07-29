defmodule GuimbalWaterworksWeb.UsersConfirmationController do
  use GuimbalWaterworksWeb, :controller

  alias GuimbalWaterworks.Accounts

  def new(conn, _params) do
    render(conn, "new.html")
  end

  def create(conn, %{"users" => %{"email" => email}}) do
    if users = Accounts.get_users_by_email(email) do
      Accounts.deliver_users_confirmation_instructions(
        users,
        &Routes.users_confirmation_url(conn, :edit, &1)
      )
    end

    conn
    |> put_flash(
      :info,
      "If your email is in our system and it has not been confirmed yet, " <>
        "you will receive an email with instructions shortly."
    )
    |> redirect(to: "/")
  end

  def edit(conn, %{"token" => token}) do
    render(conn, "edit.html", token: token)
  end

  # Do not log in the users after confirmation to avoid a
  # leaked token giving the users access to the account.
  def update(conn, %{"token" => token}) do
    case Accounts.confirm_users(token) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Users confirmed successfully.")
        |> redirect(to: "/")

      :error ->
        # If there is a current users and the account was already confirmed,
        # then odds are that the confirmation link was already visited, either
        # by some automation or by the users themselves, so we redirect without
        # a warning message.
        case conn.assigns do
          %{current_users: %{confirmed_at: confirmed_at}} when not is_nil(confirmed_at) ->
            redirect(conn, to: "/")

          %{} ->
            conn
            |> put_flash(:error, "Users confirmation link is invalid or it has expired.")
            |> redirect(to: "/")
        end
    end
  end
end
