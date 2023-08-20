defmodule GuimbalWaterworksWeb.PaymentLive.FormComponent do
  use GuimbalWaterworksWeb, :live_component
  alias Ecto.Changeset

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.Payment

  def update(
    %{
      payment: %Payment{
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
        {:ok, %{total: bill_amount}} = Bills.calculate_bill(bill, period, member)

        %{
          label: "#{period.month} #{period.year} - PHP#{Display.money(bill_amount)}", 
          value: bill.id,
          amount: bill_amount
        }
      end)

    {:ok, 
      socket
      |> assign(assigns)
      |> assign(:changeset, changeset)
      |> assign(:bill_options, bill_options)
    }
  end

  def handle_event("validate", %{"payment" => payment_params}, socket) do
    changeset =
      socket.assigns.payment
      |> Bills.change_payment(payment_params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :changeset, changeset)}
  end

  def handle_event("save", %{"payment" => payment_params}, socket) do
    case Bills.create_payment(payment_params) do
      {:ok, %{payment: payment}} ->
        {:noreply,
          socket
          |> put_flash(:info, "Payment successful")
          |> push_redirect(to: Routes.member_show_path(socket, payment.member_id))
        }
      {:error, _operation, %Changeset{} = changeset, _changes} ->
        {:noreply, assign(socket, changeset: changeset)}
      _ ->
        {:noreply, socket}
    end
  end
end
