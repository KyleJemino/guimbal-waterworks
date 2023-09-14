defmodule GuimbalWaterworksWeb.PaymentLive.PaymentList do
  use GuimbalWaterworksWeb, :live_component
  alias Decimal, as: D

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Payments
  alias GuimbalWaterworks.Helpers
  alias GuimbalWaterworksWeb.PaymentLive.Components, as: PaymentComponents

  def update(assigns, socket) do
    {:ok,
     socket
     |> assign(assigns)
     |> assign(:base_params, assigns.base_params || %{})
     |> assign(:pagination_params, Page.default_pagination_params())
     |> assign_search_params(%{})
     |> update_results()}
  end

  @impl true
  def handle_event("filter_change", %{"search_params" => search_params}, socket) do
    {:noreply,
     socket
     |> assign_search_params(search_params)
     |> assign(:pagination_params, %{
       "per_page" => socket.assigns.pagination_params["per_page"],
       "current_page" => 1
     })
     |> update_results()}
  end

  @impl true
  def handle_event(
        "per_page_change",
        %{
          "pagination_params" => %{
            "per_page" => per_page
          }
        },
        socket
      ) do
    formatted_per_page =
      if per_page == "All" do
        per_page
      else
        String.to_integer(per_page)
      end

    formatted_pagination_params = %{
      "per_page" => formatted_per_page,
      "current_page" => 1
    }

    {:noreply,
     socket
     |> assign(:pagination_params, formatted_pagination_params)
     |> update_results()}
  end

  @impl true
  def handle_event("turn_page", %{"page" => page} = _params, socket) do
    updated_pagination_params =
      Map.replace!(socket.assigns.pagination_params, "current_page", String.to_integer(page))

    {:noreply,
     socket
     |> assign(:pagination_params, updated_pagination_params)
     |> update_results()}
  end

  defp assign_payments(socket) do
    %{
      base_params: base_params,
      search_params: search_params,
      pagination_params: pagination_params
    } = socket.assigns

    payments =
      base_params
      |> Map.put(
        "preload",
        [:member, :user, bills: [:billing_period, :member, :payment]]
      )
      |> Map.merge(Page.pagination_to_query_params(pagination_params))
      |> Bills.list_payments()

    assign(socket, :payments, payments)
  end

  defp assign_payment_calculations(socket) do
    {payment_bill_map, payment_total_map, total_amount} =
      Enum.reduce(
        socket.assigns.payments,
        {%{}, %{}, 0},
        fn
          payment, {payment_bill_map_acc, payment_total_map_acc, total_acc} ->
            {bills_map, bills_total} =
              Enum.reduce(payment.bills, {%{}, 0}, fn bill, {bill_map_acc, payment_amount} ->
                bill_total = Bills.get_bill_total(bill)

                bill_map =
                  Map.put(
                    bill_map_acc,
                    Display.display_period(bill.billing_period),
                    bill_total
                  )

                {bill_map, D.add(payment_amount, bill_total)}
              end)

            {
              Map.put(payment_bill_map_acc, payment.id, bills_map),
              Map.put(payment_total_map_acc, payment.id, bills_total),
              D.add(total_acc, bills_total)
            }
        end
      )

    assign(socket, %{
      payment_bill_map: payment_bill_map,
      payment_total_map: payment_total_map,
      total: total_amount
    })
  end

  defp assign_pagination_information(%{assigns: assigns} = socket) do
    result_count =
      assigns.base_params
      |> Map.merge(assigns.search_params)
      |> Payments.count_payments()

    display_count = Enum.count(assigns.payments)

    pagination_info =
      Page.get_pagination_info(
        assigns.pagination_params,
        result_count,
        display_count
      )

    assign(socket, :pagination, pagination_info)
  end

  defp assign_search_params(socket, search_params) do
    search_params_with_values = Helpers.remove_empty_map_values(search_params)

    assign(socket, :search_params, search_params_with_values)
  end

  defp update_results(socket) do
    socket
    |> assign_payments()
    |> assign_payment_calculations()
    |> assign_pagination_information()
  end
end
