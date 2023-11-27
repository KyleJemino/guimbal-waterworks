alias Ecto.Multi
alias GuimbalWaterworks.Repo
alias GuimbalWaterworks.Members.Member

Multi.new()
|> Multi.delete_all(:members, Member)
|> Repo.transaction
