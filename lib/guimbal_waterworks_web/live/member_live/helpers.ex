defmodule GuimbalWaterworksWeb.MemberLive.Helpers do
  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworksWeb.DisplayHelpers, as: Display

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
end
