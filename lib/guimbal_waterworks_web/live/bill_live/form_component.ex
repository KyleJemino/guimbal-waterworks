defmodule GuimbalWaterworksWeb.BillLive.FormComponent do
  use GuimbalWaterworksWeb, :live_component
  alias Ecto.Changeset

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.Bill

  def update(%{bill: bill} = assigns, socket) do
    billing_period_options =
      %{
        "with_no_bill_for_member_id" => bill.member_id,
        "order_by" => [asc: :due_date]
      }
      |> Bills.list_billing_periods()
      |> Enum.map(fn period ->
        {"#{period.month} #{period.year}", period.id}
      end)

    initial_params =
      with false <- not is_nil(bill.id),
           [oldest_option | _] <- billing_period_options do
        {_, oldest_billing_period_id} = oldest_option

        %{
          billing_period_id: oldest_billing_period_id
        }
      else
        _ -> %{}
      end

    changeset =
      bill
      |> Bills.change_bill(initial_params)
      |> maybe_add_initial_before()

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:changeset, changeset)
     |> assign(:billing_period_options, billing_period_options)}
  end

  def handle_event("validate", %{"bill" => bill_params}, socket) do
    previous_changeset = socket.assigns.changeset

    changeset =
      socket.assigns.bill
      |> change_bill_maybe_with_defaults(bill_params, previous_changeset)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :changeset, changeset)}
  end

  def handle_event("save", %{"bill" => bill_params}, socket) do
    save_bill(socket, socket.assigns.action, bill_params)
  end

  defp save_bill(socket, :new, bill_params) do
    case Bills.create_bill(bill_params) do
      {:ok, _bill} ->
        {:noreply,
         socket
         |> put_flash(:info, "Bill created successfully")
         |> push_redirect(to: socket.assigns.success_path)}

      {:error, %Changeset{} = changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end

  defp save_bill(socket, :edit, bill_params) do
    case Bills.update_bill(socket.assigns.bill, bill_params) do
      {:ok, _bill} ->
        {:noreply,
         socket
         |> put_flash(:info, "Bill updated successfully")
         |> push_redirect(to: socket.assigns.success_path)}

      {:error, changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end

  defp change_bill_maybe_with_defaults(bill, params, previous_changeset)

  defp change_bill_maybe_with_defaults(%Bill{id: bill_id} = bill, params, _previous_changeset)
       when not is_nil(bill_id) do
    Bills.change_bill(bill, params)
  end

  defp change_bill_maybe_with_defaults(bill, params, previous_changeset) do
    bill
    |> Bills.change_bill(params)
    |> maybe_add_initial_before(previous_changeset)
  end

  defp maybe_add_initial_before(current_changeset, previous_changeset \\ nil) do
    previous_billing_period_change =
      if not is_nil(previous_changeset) do
        Changeset.get_change(previous_changeset, :billing_period_id)
      else
        nil
      end

    current_billing_period_change =
      Changeset.get_change(current_changeset, :billing_period_id)

    member_id =
      Changeset.get_field(current_changeset, :member_id)

    with true <-
           not is_nil(current_billing_period_change) &&
             current_billing_period_change != previous_billing_period_change,
         %Bill{after: previous_reading} <-
           Bills.get_previous_bill(member_id, current_billing_period_change) do
      Changeset.put_change(current_changeset, :before, previous_reading)
    else
      nil ->
        Changeset.force_change(current_changeset, :before, nil)

      _ ->
        current_changeset
    end
  end
end
