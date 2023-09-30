defmodule GuimbalWaterworksWeb.MemberLive.Helpers do
  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Helpers, as: GeneralHelpers
  alias GuimbalWaterworksWeb.DisplayHelpers, as: Display
  alias GuimbalWaterworksWeb.PaginationHelpers, as: Page

  @valid_filter_keys [
    "last_name",
    "first_name",
    "middle_name",
    "street",
    "type",
    "due_from",
    "due_to",
    "status",
    "id"
  ]

  def build_member_bill_map(members) do
    Enum.reduce(members, %{}, fn member, member_map_acc ->
      initial_bills_with_amount = %{
        total: 0,
        period_amount_map: %{}
      }

      bills_with_amount =
        Enum.reduce(member.bills, initial_bills_with_amount, fn bill, bill_acc ->
          %{
            total: running_total,
            period_amount_map: period_amount_map
          } = bill_acc

          {:ok, %{total: current_bill_amount}} =
            Bills.calculate_bill(bill, bill.billing_period, bill.member, bill.payment)

          %{
            total: Decimal.add(running_total, current_bill_amount),
            period_amount_map:
              Map.put(
                period_amount_map,
                Display.display_period(bill.billing_period),
                current_bill_amount
              )
          }
        end)

      Map.put(member_map_acc, member.id, bills_with_amount)
    end)
  end

  def unpaid_bill_preload_query do
    Bills.query_bill(%{
      "order_by" => [desc: :inserted_at],
      "status" => "unpaid",
      "preload" => [:billing_period, :member, :payment]
    })
  end

  def sanitize_member_filters(filter_params) do
    filter_params
    |> GeneralHelpers.remove_empty_map_values()
    |> Map.take(Page.param_keys() ++ @valid_filter_keys)
    |> Map.merge(Page.default_pagination_params(), fn _k, v1, _v2 -> v1 end)
    |> Page.sanitize_pagination_params()
  end
end
