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

    changeset = maybe_add_initial_before(bill, initial_params)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:changeset, changeset)
     |> assign(:billing_period_options, billing_period_options)}
  end

  def handle_event("validate", %{"bill" => bill_params}, socket) do
    changeset =
      socket.assigns.bill
      |> change_bill_maybe_with_defaults(bill_params)
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

  defp change_bill_maybe_with_defaults(bill, params \\ %{})

  defp change_bill_maybe_with_defaults(%Bill{id: bill_id} = bill, params)
       when not is_nil(bill_id) do
    Bills.change_bill(bill, params)
  end

  defp change_bill_maybe_with_defaults(bill, params) do
    Bills.change_bill(bill, params)
    #
    #   billing_period_change =
    #     Changeset.get_change(changeset, :billing_period_id)
    #
    #   member_id =
    #     Changeset.get_field(changeset, :member_id)
    #
    #   with true <- not is_nil(billing_period_change),
    #        %Bill{after: previous_reading} <-
    #          Bills.get_previous_bill(member_id, billing_period_change) do
    #     Changeset.put_change(changeset, :before, previous_reading)
    #   else
    #     nil ->
    #       Changeset.force_change(changeset, :before, nil)
    #
    #     _ ->
    #       changeset
    #   end
  end

  defp maybe_add_initial_before(bill, params) do
    changeset = Bills.change_bill(bill, params)

    billing_period_change =
      Changeset.get_change(changeset, :billing_period_id)

    member_id =
      Changeset.get_field(changeset, :member_id)

    with true <- not is_nil(billing_period_change),
         %Bill{after: previous_reading} <-
           Bills.get_previous_bill(member_id, billing_period_change) do
      Changeset.put_change(changeset, :before, previous_reading)
      |> IO.inspect(label: "### changeset")
    else
      nil ->
        Changeset.force_change(changeset, :before, nil)

      _ ->
        changeset
    end
  end
end
