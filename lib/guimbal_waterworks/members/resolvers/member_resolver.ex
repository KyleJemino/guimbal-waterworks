defmodule GuimbalWaterworks.Members.Resolvers.MemberResolver do
  alias GuimbalWaterworks.Repo

  alias GuimbalWaterworks.Members.Member
  alias GuimbalWaterworks.Members.Queries.MemberQuery, as: MQ

  def list_members(params \\ %{}) do
    params
    |> Map.put_new("with_archived?", false)
    |> MQ.query_member()
    |> Repo.all()
  end

  def archive_member(member) do
    member
    |> Member.archive_changeset()
    |> Repo.update()
  end
end
