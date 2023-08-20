defmodule GuimbalWaterworks.PaymentLive.FormComponent do
  use GuimbalWaterworksWeb, :live_component

  alias Ecto.Changeset
  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.Payment

  def update(
    %{
      payment: %{
        member_id: member_id,
      } = payment,
      member: member
    } = assigns, 
    socket
  ) do
    changeset = Bills.change_payment(payment)

    bill_options =
      %{
        "member_id" => member_id,
        "status" => :unpaid,
        "preload" => :billing_period
      }
      |> Bills.list_bills()
      |> Enum.map(fn %{billing_period: period} = bill ->
        bill_amount = calculate_bill(bill, period, member)
        {
          "#{period.month} #{period.year} - PHP#{Display.money(bill_amount)}", 
          bill.id
        }
      end)

    {:ok, 
      socket
      |> assign(assigns)
      |> assign(:changeset, changeset)
      |> assign(:bill_options, bill_options)
    }
  end
end
