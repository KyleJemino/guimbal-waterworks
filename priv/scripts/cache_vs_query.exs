alias GuimbalWaterworks.Bills
alias GuimbalWaterworks.Bills.{
  BillingPeriod,
  Rate
}
alias GuimbalWaterworks.Backroom.RecordCache, as: Cache
alias GuimbalWaterworksWeb.DisplayHelpers, as: Display
alias Decimal, as: D

Benchee.run(
  %{
    "with_bp_and_rate" => fn ->
      params = %{
        "preload" => [
          :member,
          :user,
          bills: [
            :member,
            :payment,
            billing_period: [:rate]
          ]
        ],
        "limit" => 100
      }

      payments = Bills.list_payments(params)

      {reversed_payment_rows, all_payments_total} =
        Enum.reduce(
          payments,
          {[], 0},
          fn payment, acc ->
            {rows_acc, running_total} = acc

            {reversed_bills_data, payment_total} =
              Enum.reduce(payment.bills, {[], 0}, fn bill, {bill_list, running_payment_total} ->
                bill_total = Bills.get_bill_total(bill)

                bill_item = %{
                  name: Display.display_period(bill.billing_period),
                  amount: bill_total
                }

                {[bill_item | bill_list], D.add(running_payment_total, bill_total)}
              end)

            bills_data =
              Enum.reverse([%{name: "TOTAL", amount: payment_total} | reversed_bills_data])

            payment_data = %{
              member: Display.full_name(payment.member),
              or: payment.or,
              bills: bills_data,
              total_paid: payment.amount,
              paid_at: Display.format_date(payment.paid_at),
              cashier: Display.full_name(payment.user)
            }

            updated_total = D.add(running_total, payment_total)

            {[payment_data | rows_acc], updated_total}
          end
        )

      total_row = %{
        member: "TOTAL",
        or: "",
        bills: [],
        total_paid: all_payments_total,
        paid_at: "",
        cashier: ""
      }

      table_data =
        reversed_payment_rows
        |> List.insert_at(0, total_row)
        |> Enum.reverse()
    end,
    "no_bill_member_and_payment_preload" => fn ->
      params = %{
        "preload" => [
          :member,
          :user,
          bills: [
            billing_period: [:rate]
          ]
        ],
        "limit" => 100
      }

      payments = Bills.list_payments(params)

      {reversed_payment_rows, all_payments_total} =
        Enum.reduce(
          payments,
          {[], 0},
          fn payment, acc ->
            {rows_acc, running_total} = acc

            {reversed_bills_data, payment_total} =
              Enum.reduce(payment.bills, {[], 0}, fn bill, {bill_list, running_payment_total} ->
                {:ok,  %{total: bill_total}} = 
                  Bills.calculate_bill(bill, bill.billing_period, payment.member, payment, bill.billing_period.rate)

                bill_item = %{
                  name: Display.display_period(bill.billing_period),
                  amount: bill_total
                }

                {[bill_item | bill_list], D.add(running_payment_total, bill_total)}
              end)

            bills_data =
              Enum.reverse([%{name: "TOTAL", amount: payment_total} | reversed_bills_data])

            payment_data = %{
              member: Display.full_name(payment.member),
              or: payment.or,
              bills: bills_data,
              total_paid: payment.amount,
              paid_at: Display.format_date(payment.paid_at),
              cashier: Display.full_name(payment.user)
            }

            updated_total = D.add(running_total, payment_total)

            {[payment_data | rows_acc], updated_total}
          end
        )

      total_row = %{
        member: "TOTAL",
        or: "",
        bills: [],
        total_paid: all_payments_total,
        paid_at: "",
        cashier: ""
      }

      table_data =
        reversed_payment_rows
        |> List.insert_at(0, total_row)
        |> Enum.reverse()
    end,
    "without_bill_field_preload_using_cache" => fn ->
      params = %{
        "preload" => [
          :member,
          :user,
          :bills
        ],
        "limit" => 100
      }

      {:ok, cache} = Cache.start_link()

      payments= Bills.list_payments(params)

      {reversed_payment_rows, all_payments_total} =
        Enum.reduce(
          payments,
          {[], 0},
          fn payment, acc ->
            {rows_acc, running_total} = acc

            {reversed_bills_data, payment_total} =
              Enum.reduce(payment.bills, {[], 0}, fn bill, {bill_list, running_payment_total} ->
                billing_period = Cache.get_record(cache, BillingPeriod, bill.billing_period_id)
                rate = Cache.get_record(cache, Rate, billing_period.rate_id)

                {:ok,  %{total: bill_total}} = 
                  Bills.calculate_bill(bill, billing_period, payment.member, payment, rate)

                bill_item = %{
                  name: Display.display_period(billing_period),
                  amount: bill_total
                }

                {[bill_item | bill_list], D.add(running_payment_total, bill_total)}
              end)

            bills_data =
              Enum.reverse([%{name: "TOTAL", amount: payment_total} | reversed_bills_data])

            payment_data = %{
              member: Display.full_name(payment.member),
              or: payment.or,
              bills: bills_data,
              total_paid: payment.amount,
              paid_at: Display.format_date(payment.paid_at),
              cashier: Display.full_name(payment.user)
            }

            updated_total = D.add(running_total, payment_total)

            {[payment_data | rows_acc], updated_total}
          end
        )

      Cache.stop(cache)

      total_row = %{
        member: "TOTAL",
        or: "",
        bills: [],
        total_paid: all_payments_total,
        paid_at: "",
        cashier: ""
      }

      table_data =
        reversed_payment_rows
        |> List.insert_at(0, total_row)
        |> Enum.reverse()
    end
  },
  memory_time: 5
)
