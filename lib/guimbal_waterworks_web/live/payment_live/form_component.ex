defmodule GuimbalWaterworksWeb.PaymentLive.FormComponent do
  use GuimbalWaterworksWeb, :live_component
  alias Ecto.Changeset

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.Payment

  def update(
        %{
          payment:
            %Payment{
              member_id: member_id
            } = payment
        } = assigns,
        socket
      ) do
    changeset = payment_changeset_fn(payment, assigns.action)

    bills =
      Bills.list_bills(%{
        "member_id" => member_id,
        "status" => "unpaid",
        "preload" => [:payment, :member, billing_period: [:rate]],
        "order_by" => "oldest_first"
      })

    latest_bill = List.last(bills)
    reconnection_fees = [Decimal.new("0.00")] ++ latest_bill.billing_period.rate.reconnection_fees
    reconnection_fee_options =
      reconnection_fees
      |> Enum.sort(&Decimal.lt?(&1, &2))
      |> Enum.map(&([
        key: Display.money(&1),
        value: Decimal.to_string(&1),
      ]))

    {bills_display, payment_options, bill_breakdown_map} =
      Enum.reduce(bills, {[], [], %{}}, fn
        bill, acc ->
          %{billing_period: period} = bill
          {bills_display_acc, payment_options_acc, bill_breakdown_map_acc} = acc

          {:ok, %{total: bill_amount} = breakdown} =
            Bills.calculate_bill(bill, bill.billing_period, bill.member, bill.payment)

          bill_name = "#{period.month} #{period.year}"

          curr_bills_display = "#{bill_name} - PHP#{Display.money(bill_amount)}"

          curr_payment_option =
            case payment_options_acc do
              [head | _tail] ->
                total_amount = Decimal.add(head.total_amount, bill_amount)

                %{
                  billing_periods: "#{head.billing_periods}, #{bill_name}",
                  total_amount: total_amount,
                  bill_ids: "#{head.bill_ids},#{bill.id}"
                }

              [] ->
                %{
                  billing_periods: bill_name,
                  total_amount: bill_amount,
                  bill_ids: bill.id
                }
            end

          {
            [curr_bills_display | bills_display_acc],
            [curr_payment_option | payment_options_acc],
            Map.put(bill_breakdown_map_acc, bill.id, breakdown)
          }
      end)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(%{
       bills: bills,
       bill_breakdown_map: bill_breakdown_map,
       bills_display: Enum.reverse(bills_display),
       payment_options: Enum.reverse(payment_options),
       reconnection_fee_options: reconnection_fee_options,
       total: Decimal.new("0.00")
     })
     |> assign_changeset(changeset)}
  end

  def render(assigns) do
    ~H"""
    <div class="form-modal-container">
      <h1 class="text-center"><%= @title %></h1>

      <.form
        let={f}
        for={@changeset}
        id="bill-form"
        phx-target={@myself}
        phx-change="validate"
        phx-submit="save"
        class="form-component"
        >

        <%= hidden_input f, :member_id, required: true %>
        <%= hidden_input f, :user_id, required: true %>

        <div class="field-group">
          <%= label f, :or, class: "uppercase" %>
          <%= text_input f, :or, required: true %>
          <%= error_tag f, :or %>
        </div>

        <%= if @action == :new do %>
          <div class="flex flex-col gap-2 mt-3">
            <h4>Unpaid Bills:</h4>
            <div class="flex flex-col gap-1">
              <%= for bill <- @bills_display do %>
                <p class="font-medium"><%= bill %></p>
              <% end %>
            </div>
          </div>

          <div class="flex flex-col gap-2 mt-3">
            <h4>Select Bills to Pay:</h4>
            <div class="flex flex-col gap-1">
              <%= for payment_option <- @payment_options do %>
                <div class="flex items-center gap-2">
                  <%= radio_button f, :bill_ids, payment_option.bill_ids %>
                  <span><%= "#{payment_option.billing_periods} - PHP#{Display.money(payment_option.total_amount)}" %></span>
                </div>
              <% end %>
              <%= error_tag f, :bill_ids %>
            </div>
          </div>

          <div class="flex flex-col gap-2 mt-3">
            <h4>Reconnection Fee</h4>
            <%= select f, :reconnection_fee, @reconnection_fee_options, selected: Decimal.new("0.00") %>
          </div>
        <% end %>

        <div class="flex mt-3">
          <h4>TOTAL: <%= Display.money(@total) %></h4>
        </div>

        <div class="form-button-group">
          <%= submit "Save", phx_disable_with: "Saving...", class: "submit" %>
        </div>
      </.form>
    </div>
    """
  end

  def handle_event("validate", %{"payment" => payment_params}, socket) do
    %{
      payment: payment,
      action: action,
      bills: bills,
    } = socket.assigns

    changeset =
      payment
      |> payment_changeset_fn(payment_params, action)
      |> Map.put(:action, :validate)

    total = calculate_total(payment_params, bills)

    socket =
      socket
      |> assign_changeset(changeset)
      |> assign(%{total: total})

    {:noreply, socket}
  end

  def handle_event("save", %{"payment" => payment_params}, socket) do
    case save_payment(payment_params, socket) do
      {:ok, %{payment: payment}} ->
        {:noreply,
         socket
         |> put_flash(:info, "Payment successful")
         |> push_redirect(to: Routes.member_show_path(socket, :show, payment.member_id))}

      {:ok, %Payment{} = payment} ->
        {:noreply,
         socket
         |> put_flash(:info, "Payment edit successful")
         |> push_redirect(to: Routes.member_show_path(socket, :show, payment.member_id))}

      {:error, _operation, %Changeset{} = changeset, _changes} ->
        {:noreply, assign_changeset(socket, changeset)}

      _ ->
        {:noreply, socket}
    end
  end

  defp save_payment(params, socket) do
    if socket.assigns.action == :new do
      Bills.create_payment(params)
    else
      Bills.edit_payment(socket.assigns.payment, params)
    end
  end

  defp assign_changeset(socket, changeset) do
    assign(socket, :changeset, changeset)
  end

  defp payment_changeset_fn(payment, attrs \\ %{}, action)

  defp payment_changeset_fn(payment, attrs, :edit), do: Payment.edit_changeset(payment, attrs)

  defp payment_changeset_fn(payment, attrs, :new), do: Payment.changeset(payment, attrs)

  defp calculate_total(%{"bill_ids" => bill_ids} = params, bills)
    when is_binary(bill_ids) and bill_ids != "" do
    bill_ids = String.split(bill_ids, ",")

    selected_bills =
      Enum.filter(bills, &(&1.id in bill_ids))

    bill_total =
      Enum.reduce(selected_bills, Decimal.new("0.00"), fn bill, acc ->
        bill
        |> Bills.calculate_bill!()
        |> Map.get(:total)
        |> Decimal.add(acc)
      end)

    reconnection_fee =
      params
      |> Map.get("reconnection_fee", "0.00")
      |> Decimal.new()

    Decimal.add(bill_total, reconnection_fee)
  end

  defp calculate_total(params, bills) do
    0
  end
end
