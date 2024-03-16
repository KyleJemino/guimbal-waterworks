defmodule GuimbalWaterworksWeb.MemberLive.Helpers do
  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.{
    Bill,
    BillingPeriod
  }
  alias GuimbalWaterworks.Members.Member
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

  def get_member_status(%Member{
    connected?: true
  } = member) do
    case get_overdue_bills_count(member) do
      0 -> "Updated Payments"
      1 -> "With 1 Unpaid"
      _ -> "For Disconnection"
    end
  end

  def get_member_status(%Member{
    connected?: false
  } = member) do
    if get_overdue_bills_count(member) < 2 do
      "For Reconnection"
    else
      "Disconnected"
    end
  end

  def get_overdue_bills_count(member) do
    Enum.count(member.bills, fn bill ->
      %{ 
        payment: payment,
        member: %Member{} = member,
        billing_period: %BillingPeriod{
          rate: rate,
          due_date: due_date
        } = billing_period,
      } = bill


      date_to_compare = 
        if not is_nil(payment) do
          payment.paid_at
        else
          Date.utc_today()
        end

      Date.diff(date_to_compare, due_date) > 0
    end)
  end

  def unpaid_bill_preload_query do
    Bills.query_bill(%{
      "order_by" => "default",
      "status" => "unpaid",
      "preload" => [
        :payment,
        :member,
        billing_period: [:rate]
      ]
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
