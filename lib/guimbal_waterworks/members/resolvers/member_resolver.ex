defmodule GuimbalWaterworks.Members.Resolvers.MemberResolver do
  alias GuimbalWaterworks.Repo
  alias GuimbalWaterworks.Members.Member

  def archive_member(member) do
    member
    |> Member.archive_changeset()
    |> Repo.update()
  end
end
