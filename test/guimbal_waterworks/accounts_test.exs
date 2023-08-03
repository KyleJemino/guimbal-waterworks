defmodule GuimbalWaterworks.AccountsTest do
  use GuimbalWaterworks.DataCase

  alias GuimbalWaterworks.Accounts

  import GuimbalWaterworks.AccountsFixtures
  alias GuimbalWaterworks.Accounts.{Users, UsersToken}

  describe "get_users_by_email/1" do
    test "does not return the users if the email does not exist" do
      refute Accounts.get_users_by_email("unknown@example.com")
    end

    test "returns the users if the email exists" do
      %{id: id} = users = users_fixture()
      assert %Users{id: ^id} = Accounts.get_users_by_email(users.email)
    end
  end

  describe "get_users_by_email_and_password/2" do
    test "does not return the users if the email does not exist" do
      refute Accounts.get_users_by_email_and_password("unknown@example.com", "hello world!")
    end

    test "does not return the users if the password is not valid" do
      users = users_fixture()
      refute Accounts.get_users_by_email_and_password(users.email, "invalid")
    end

    test "returns the users if the email and password are valid" do
      %{id: id} = users = users_fixture()

      assert %Users{id: ^id} =
               Accounts.get_users_by_email_and_password(users.email, valid_users_password())
    end
  end

  describe "get_users!/1" do
    test "raises if id is invalid" do
      assert_raise Ecto.NoResultsError, fn ->
        Accounts.get_users!(-1)
      end
    end

    test "returns the users with the given id" do
      %{id: id} = users = users_fixture()
      assert %Users{id: ^id} = Accounts.get_users!(users.id)
    end
  end

  describe "register_users/1" do
    test "requires email and password to be set" do
      {:error, changeset} = Accounts.register_users(%{})

      assert %{
               password: ["can't be blank"],
               email: ["can't be blank"]
             } = errors_on(changeset)
    end

    test "validates email and password when given" do
      {:error, changeset} = Accounts.register_users(%{email: "not valid", password: "not valid"})

      assert %{
               email: ["must have the @ sign and no spaces"],
               password: ["should be at least 12 character(s)"]
             } = errors_on(changeset)
    end

    test "validates maximum values for email and password for security" do
      too_long = String.duplicate("db", 100)
      {:error, changeset} = Accounts.register_users(%{email: too_long, password: too_long})
      assert "should be at most 160 character(s)" in errors_on(changeset).email
      assert "should be at most 72 character(s)" in errors_on(changeset).password
    end

    test "validates email uniqueness" do
      %{email: email} = users_fixture()
      {:error, changeset} = Accounts.register_users(%{email: email})
      assert "has already been taken" in errors_on(changeset).email

      # Now try with the upper cased email too, to check that email case is ignored.
      {:error, changeset} = Accounts.register_users(%{email: String.upcase(email)})
      assert "has already been taken" in errors_on(changeset).email
    end

    test "registers users with a hashed password" do
      email = unique_users_email()
      {:ok, users} = Accounts.register_users(valid_users_attributes(email: email))
      assert users.email == email
      assert is_binary(users.hashed_password)
      assert is_nil(users.confirmed_at)
      assert is_nil(users.password)
    end
  end

  describe "change_users_registration/2" do
    test "returns a changeset" do
      assert %Ecto.Changeset{} = changeset = Accounts.change_users_registration(%Users{})
      assert changeset.required == [:password, :email]
    end

    test "allows fields to be set" do
      email = unique_users_email()
      password = valid_users_password()

      changeset =
        Accounts.change_users_registration(
          %Users{},
          valid_users_attributes(email: email, password: password)
        )

      assert changeset.valid?
      assert get_change(changeset, :email) == email
      assert get_change(changeset, :password) == password
      assert is_nil(get_change(changeset, :hashed_password))
    end
  end

  describe "change_users_email/2" do
    test "returns a users changeset" do
      assert %Ecto.Changeset{} = changeset = Accounts.change_users_email(%Users{})
      assert changeset.required == [:email]
    end
  end

  describe "apply_users_email/3" do
    setup do
      %{users: users_fixture()}
    end

    test "requires email to change", %{users: users} do
      {:error, changeset} = Accounts.apply_users_email(users, valid_users_password(), %{})
      assert %{email: ["did not change"]} = errors_on(changeset)
    end

    test "validates email", %{users: users} do
      {:error, changeset} =
        Accounts.apply_users_email(users, valid_users_password(), %{email: "not valid"})

      assert %{email: ["must have the @ sign and no spaces"]} = errors_on(changeset)
    end

    test "validates maximum value for email for security", %{users: users} do
      too_long = String.duplicate("db", 100)

      {:error, changeset} =
        Accounts.apply_users_email(users, valid_users_password(), %{email: too_long})

      assert "should be at most 160 character(s)" in errors_on(changeset).email
    end

    test "validates email uniqueness", %{users: users} do
      %{email: email} = users_fixture()

      {:error, changeset} =
        Accounts.apply_users_email(users, valid_users_password(), %{email: email})

      assert "has already been taken" in errors_on(changeset).email
    end

    test "validates current password", %{users: users} do
      {:error, changeset} =
        Accounts.apply_users_email(users, "invalid", %{email: unique_users_email()})

      assert %{current_password: ["is not valid"]} = errors_on(changeset)
    end

    test "applies the email without persisting it", %{users: users} do
      email = unique_users_email()
      {:ok, users} = Accounts.apply_users_email(users, valid_users_password(), %{email: email})
      assert users.email == email
      assert Accounts.get_users!(users.id).email != email
    end
  end

  describe "deliver_update_email_instructions/3" do
    setup do
      %{users: users_fixture()}
    end

    test "sends token through notification", %{users: users} do
      token =
        extract_users_token(fn url ->
          Accounts.deliver_update_email_instructions(users, "current@example.com", url)
        end)

      {:ok, token} = Base.url_decode64(token, padding: false)
      assert users_token = Repo.get_by(UsersToken, token: :crypto.hash(:sha256, token))
      assert users_token.users_id == users.id
      assert users_token.sent_to == users.email
      assert users_token.context == "change:current@example.com"
    end
  end

  describe "update_users_email/2" do
    setup do
      users = users_fixture()
      email = unique_users_email()

      token =
        extract_users_token(fn url ->
          Accounts.deliver_update_email_instructions(%{users | email: email}, users.email, url)
        end)

      %{users: users, token: token, email: email}
    end

    test "updates the email with a valid token", %{users: users, token: token, email: email} do
      assert Accounts.update_users_email(users, token) == :ok
      changed_users = Repo.get!(Users, users.id)
      assert changed_users.email != users.email
      assert changed_users.email == email
      assert changed_users.confirmed_at
      assert changed_users.confirmed_at != users.confirmed_at
      refute Repo.get_by(UsersToken, users_id: users.id)
    end

    test "does not update email with invalid token", %{users: users} do
      assert Accounts.update_users_email(users, "oops") == :error
      assert Repo.get!(Users, users.id).email == users.email
      assert Repo.get_by(UsersToken, users_id: users.id)
    end

    test "does not update email if users email changed", %{users: users, token: token} do
      assert Accounts.update_users_email(%{users | email: "current@example.com"}, token) == :error
      assert Repo.get!(Users, users.id).email == users.email
      assert Repo.get_by(UsersToken, users_id: users.id)
    end

    test "does not update email if token expired", %{users: users, token: token} do
      {1, nil} = Repo.update_all(UsersToken, set: [inserted_at: ~N[2020-01-01 00:00:00]])
      assert Accounts.update_users_email(users, token) == :error
      assert Repo.get!(Users, users.id).email == users.email
      assert Repo.get_by(UsersToken, users_id: users.id)
    end
  end

  describe "change_users_password/2" do
    test "returns a users changeset" do
      assert %Ecto.Changeset{} = changeset = Accounts.change_users_password(%Users{})
      assert changeset.required == [:password]
    end

    test "allows fields to be set" do
      changeset =
        Accounts.change_users_password(%Users{}, %{
          "password" => "new valid password"
        })

      assert changeset.valid?
      assert get_change(changeset, :password) == "new valid password"
      assert is_nil(get_change(changeset, :hashed_password))
    end
  end

  describe "update_users_password/3" do
    setup do
      %{users: users_fixture()}
    end

    test "validates password", %{users: users} do
      {:error, changeset} =
        Accounts.update_users_password(users, valid_users_password(), %{
          password: "not valid",
          password_confirmation: "another"
        })

      assert %{
               password: ["should be at least 12 character(s)"],
               password_confirmation: ["does not match password"]
             } = errors_on(changeset)
    end

    test "validates maximum values for password for security", %{users: users} do
      too_long = String.duplicate("db", 100)

      {:error, changeset} =
        Accounts.update_users_password(users, valid_users_password(), %{password: too_long})

      assert "should be at most 72 character(s)" in errors_on(changeset).password
    end

    test "validates current password", %{users: users} do
      {:error, changeset} =
        Accounts.update_users_password(users, "invalid", %{password: valid_users_password()})

      assert %{current_password: ["is not valid"]} = errors_on(changeset)
    end

    test "updates the password", %{users: users} do
      {:ok, users} =
        Accounts.update_users_password(users, valid_users_password(), %{
          password: "new valid password"
        })

      assert is_nil(users.password)
      assert Accounts.get_users_by_email_and_password(users.email, "new valid password")
    end

    test "deletes all tokens for the given users", %{users: users} do
      _ = Accounts.generate_users_session_token(users)

      {:ok, _} =
        Accounts.update_users_password(users, valid_users_password(), %{
          password: "new valid password"
        })

      refute Repo.get_by(UsersToken, users_id: users.id)
    end
  end

  describe "generate_users_session_token/1" do
    setup do
      %{users: users_fixture()}
    end

    test "generates a token", %{users: users} do
      token = Accounts.generate_users_session_token(users)
      assert users_token = Repo.get_by(UsersToken, token: token)
      assert users_token.context == "session"

      # Creating the same token for another users should fail
      assert_raise Ecto.ConstraintError, fn ->
        Repo.insert!(%UsersToken{
          token: users_token.token,
          users_id: users_fixture().id,
          context: "session"
        })
      end
    end
  end

  describe "get_users_by_session_token/1" do
    setup do
      users = users_fixture()
      token = Accounts.generate_users_session_token(users)
      %{users: users, token: token}
    end

    test "returns users by token", %{users: users, token: token} do
      assert session_users = Accounts.get_users_by_session_token(token)
      assert session_users.id == users.id
    end

    test "does not return users for invalid token" do
      refute Accounts.get_users_by_session_token("oops")
    end

    test "does not return users for expired token", %{token: token} do
      {1, nil} = Repo.update_all(UsersToken, set: [inserted_at: ~N[2020-01-01 00:00:00]])
      refute Accounts.get_users_by_session_token(token)
    end
  end

  describe "delete_session_token/1" do
    test "deletes the token" do
      users = users_fixture()
      token = Accounts.generate_users_session_token(users)
      assert Accounts.delete_session_token(token) == :ok
      refute Accounts.get_users_by_session_token(token)
    end
  end

  describe "deliver_users_confirmation_instructions/2" do
    setup do
      %{users: users_fixture()}
    end

    test "sends token through notification", %{users: users} do
      token =
        extract_users_token(fn url ->
          Accounts.deliver_users_confirmation_instructions(users, url)
        end)

      {:ok, token} = Base.url_decode64(token, padding: false)
      assert users_token = Repo.get_by(UsersToken, token: :crypto.hash(:sha256, token))
      assert users_token.users_id == users.id
      assert users_token.sent_to == users.email
      assert users_token.context == "confirm"
    end
  end

  describe "confirm_users/1" do
    setup do
      users = users_fixture()

      token =
        extract_users_token(fn url ->
          Accounts.deliver_users_confirmation_instructions(users, url)
        end)

      %{users: users, token: token}
    end

    test "confirms the email with a valid token", %{users: users, token: token} do
      assert {:ok, confirmed_users} = Accounts.confirm_users(token)
      assert confirmed_users.confirmed_at
      assert confirmed_users.confirmed_at != users.confirmed_at
      assert Repo.get!(Users, users.id).confirmed_at
      refute Repo.get_by(UsersToken, users_id: users.id)
    end

    test "does not confirm with invalid token", %{users: users} do
      assert Accounts.confirm_users("oops") == :error
      refute Repo.get!(Users, users.id).confirmed_at
      assert Repo.get_by(UsersToken, users_id: users.id)
    end

    test "does not confirm email if token expired", %{users: users, token: token} do
      {1, nil} = Repo.update_all(UsersToken, set: [inserted_at: ~N[2020-01-01 00:00:00]])
      assert Accounts.confirm_users(token) == :error
      refute Repo.get!(Users, users.id).confirmed_at
      assert Repo.get_by(UsersToken, users_id: users.id)
    end
  end

  describe "deliver_users_reset_password_instructions/2" do
    setup do
      %{users: users_fixture()}
    end

    test "sends token through notification", %{users: users} do
      token =
        extract_users_token(fn url ->
          Accounts.deliver_users_reset_password_instructions(users, url)
        end)

      {:ok, token} = Base.url_decode64(token, padding: false)
      assert users_token = Repo.get_by(UsersToken, token: :crypto.hash(:sha256, token))
      assert users_token.users_id == users.id
      assert users_token.sent_to == users.email
      assert users_token.context == "reset_password"
    end
  end

  describe "get_users_by_reset_password_token/1" do
    setup do
      users = users_fixture()

      token =
        extract_users_token(fn url ->
          Accounts.deliver_users_reset_password_instructions(users, url)
        end)

      %{users: users, token: token}
    end

    test "returns the users with valid token", %{users: %{id: id}, token: token} do
      assert %Users{id: ^id} = Accounts.get_users_by_reset_password_token(token)
      assert Repo.get_by(UsersToken, users_id: id)
    end

    test "does not return the users with invalid token", %{users: users} do
      refute Accounts.get_users_by_reset_password_token("oops")
      assert Repo.get_by(UsersToken, users_id: users.id)
    end

    test "does not return the users if token expired", %{users: users, token: token} do
      {1, nil} = Repo.update_all(UsersToken, set: [inserted_at: ~N[2020-01-01 00:00:00]])
      refute Accounts.get_users_by_reset_password_token(token)
      assert Repo.get_by(UsersToken, users_id: users.id)
    end
  end

  describe "reset_users_password/2" do
    setup do
      %{users: users_fixture()}
    end

    test "validates password", %{users: users} do
      {:error, changeset} =
        Accounts.reset_users_password(users, %{
          password: "not valid",
          password_confirmation: "another"
        })

      assert %{
               password: ["should be at least 12 character(s)"],
               password_confirmation: ["does not match password"]
             } = errors_on(changeset)
    end

    test "validates maximum values for password for security", %{users: users} do
      too_long = String.duplicate("db", 100)
      {:error, changeset} = Accounts.reset_users_password(users, %{password: too_long})
      assert "should be at most 72 character(s)" in errors_on(changeset).password
    end

    test "updates the password", %{users: users} do
      {:ok, updated_users} =
        Accounts.reset_users_password(users, %{password: "new valid password"})

      assert is_nil(updated_users.password)
      assert Accounts.get_users_by_email_and_password(users.email, "new valid password")
    end

    test "deletes all tokens for the given users", %{users: users} do
      _ = Accounts.generate_users_session_token(users)
      {:ok, _} = Accounts.reset_users_password(users, %{password: "new valid password"})
      refute Repo.get_by(UsersToken, users_id: users.id)
    end
  end

  describe "inspect/2" do
    test "does not include password" do
      refute inspect(%Users{password: "123456"}) =~ "password: \"123456\""
    end
  end
end
