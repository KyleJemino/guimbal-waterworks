defmodule GuimbalWaterworks.Accounts.UsersNotifier do
  import Swoosh.Email

  alias GuimbalWaterworks.Mailer

  # Delivers the email using the application mailer.
  defp deliver(recipient, subject, body) do
    email =
      new()
      |> to(recipient)
      |> from({"GuimbalWaterworks", "contact@example.com"})
      |> subject(subject)
      |> text_body(body)

    with {:ok, _metadata} <- Mailer.deliver(email) do
      {:ok, email}
    end
  end

  @doc """
  Deliver instructions to confirm account.
  """
  def deliver_confirmation_instructions(users, url) do
    deliver(users.email, "Confirmation instructions", """

    ==============================

    Hi #{users.email},

    You can confirm your account by visiting the URL below:

    #{url}

    If you didn't create an account with us, please ignore this.

    ==============================
    """)
  end

  @doc """
  Deliver instructions to reset a users password.
  """
  def deliver_reset_password_instructions(users, url) do
    deliver(users.email, "Reset password instructions", """

    ==============================

    Hi #{users.email},

    You can reset your password by visiting the URL below:

    #{url}

    If you didn't request this change, please ignore this.

    ==============================
    """)
  end

  @doc """
  Deliver instructions to update a users email.
  """
  def deliver_update_email_instructions(users, url) do
    deliver(users.email, "Update email instructions", """

    ==============================

    Hi #{users.email},

    You can change your email by visiting the URL below:

    #{url}

    If you didn't request this change, please ignore this.

    ==============================
    """)
  end
end
