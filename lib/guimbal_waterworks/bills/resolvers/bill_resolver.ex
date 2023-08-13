defmodule GuimbalWaterworks.Bills.Resolvers.BillResolver do
  alias GuimbalWaterworks.Repo
  alias GuimbalWaterworks.Bills.Bill
  alias GuimbalWaterworks.Bills.Queries.BillQuery, as: BQ

  def list_bills(params \\ %{}) do
    params
    |> BQ.query_bill()
    |> Repo.all()
  end

  def get_bill_by_id(id) do
    %{"id" => id}
    |> BQ.query_bill()
    |> Repo.one()
  end

  def get_bill(params \\ %{}) do
    params
    |> BQ.query_bill()
    |> Repo.one()
  end

  def create_bill(params \\ %{}) do
    %Bill{}
    |> Bill.changeset(params)
    |> Repo.insert()
  end

  def change_bill(%Bill{} = bill, params \\ %{}) do
    Bill.changeset(bill, params)
  end

  def new_bill(params) do
    params_with_defaults =
      params
      |> Map.merge(
        %{
          membership_fee?: false,
          adv_fee?: false,
          reconnection_fee?: false
        },
        fn _k, v1, _v2 -> v1 end
      )

    struct(Bill, params_with_defaults)
  end
end
