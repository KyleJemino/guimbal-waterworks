alias GuimbalWaterworks.Repo
alias GuimbalWaterworks.Accounts.Users

super_user_attrs = %{
  username: "superuser",
  first_name: "Analia",
  middle_name: nil,
  last_name: "Cabral",
  role: :manager,
  password: "AgwVKrfLRgJv",
  password_confirmation: "AgwVKrfLRgJv",
  approved_at: DateTime.utc_now()
}

%Users{}
|> Users.super_changeset(super_user_attrs)
|> Repo.insert!()
