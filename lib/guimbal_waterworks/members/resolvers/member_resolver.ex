defmodule GuimbalWaterworks.Members.Resolvers.MemberResolver do
  alias GuimbalWaterworks.Repo

  alias GuimbalWaterworks.Members.Member
  alias GuimbalWaterworks.Members.Queries.MemberQuery, as: MQ
  alias GuimbalWaterworks.Bills

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

  def calculate_member_bills(%Member{bills: bills, type: type} = member) when is_list(bills) do
    Enum.reduce(bills, 0, fn bill, acc ->
      {:ok, %{total: total} = bill} = Bills.calculate_bill(bill, type)

      Decimal.add(total, acc)
    end)
  end
end
