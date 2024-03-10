defmodule GuimbalWaterworksWeb.MemberLive.History do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.Payment
  alias GuimbalWaterworks.Members
  alias GuimbalWaterworksWeb.DisplayHelpers, as: Display
  alias Decimal, as: D

  @impl true
  def mount(
        %{
          "id" => member_id,
          "from_year" => from,
          "to_year" => to
        },
        _session,
        socket
      ) do
    member = Members.get_member!(member_id)

    bill_params = %{
      "member_id" => member_id,
      "from" => from,
      "to" => to,
      "preload" => [:payment, billing_period: :rate],
      "order_by" => "oldest_first"
    }

    table_data =
      bill_params
      |> Bills.list_bills()
      |> format_bills_to_table_data(member)

    {:ok,
     socket
     |> assign(:table_data, table_data)
     |> assign(:member, member)}
  end

  defp format_bills_to_table_data(bills, member) do
    Enum.map(bills, fn bill ->
      %{
        billing_period: billing_period,
        payment: payment
      } = bill

      period_name = Display.display_period(billing_period)
      reading = Bills.get_bill_reading(bill)

      {:ok,
       %{
         base_amount: base_amount,
         franchise_tax_amount: franchise_tax,
         surcharge: surcharge,
         death_aid_amount: death_aid_amount,
         reconnection_amount: reconnection_amount,
         membership_amount: membership_amount,
         total: total
       }} = Bills.calculate_bill(bill, billing_period, member, payment)

      other_fees =
        reconnection_amount
        |> D.add(membership_amount)
        |> Display.money()

      remarks =
        case payment do
          %Payment{or: payment_or, paid_at: paid_at} ->
            "#{payment_or}\n#{Display.format_date(paid_at)}"

          _ ->
            ""
        end

      %{
        period_name: period_name,
        reading: reading,
        base_amount: Display.money(base_amount),
        franchise_tax: Display.money(franchise_tax),
        surcharge: Display.money(surcharge),
        death_aid: Display.money(death_aid_amount),
        other_fees: other_fees,
        total: Display.money(total),
        remarks: remarks
      }
    end)
  end
end
