defmodule GuimbalWaterworksWeb.BillingPeriodLive.Show do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Members

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => id} = params, _, socket) do
    {:noreply,
     socket
     |> assign(:page_title, page_title(socket.assigns.live_action))
     |> assign(:billing_period, Bills.get_billing_period!(id))
     |> assign(:filter_params, params)
     |> assign(:clean_params, Map.drop(params, ["id", "member_id", "bill_id"]))
     |> assign_member(params)
     |> assign_bill(socket.assigns.live_action, params)
     |> assign_bill_success_path()
     |> assign_return_to()}
  end

  @impl true
  def handle_info({:create_member_bill, member_id}, socket) do
    %{
      clean_params: clean_params,
      billing_period: billing_period
    } = socket.assigns

    create_bill_path =
      Routes.billing_period_show_path(
        socket,
        :new_bill,
        billing_period,
        member_id,
        clean_params
      )

    {:noreply, push_patch(socket, to: create_bill_path)}
  end

  def handle_info({:edit_bill, bill_id}, socket) do
    %{
      clean_params: clean_params,
      billing_period: billing_period
    } = socket.assigns

    edit_bill_path =
      Routes.billing_period_show_path(
        socket,
        :edit_bill,
        billing_period,
        bill_id,
        clean_params
      )

    {:noreply, push_patch(socket, to: edit_bill_path)}
  end

  defp page_title(:edit), do: "Edit Billing period"
  defp page_title(_), do: "Show Billing period"

  defp assign_return_to(socket) do
    params = socket.assigns.filter_params

    return_to =
      Routes.billing_period_show_path(
        socket,
        :show,
        Map.get(params, "id"),
        socket.assigns.clean_params
      )

    assign(socket, :return_to, return_to)
  end

  defp assign_bill_success_path(socket) do
    params = socket.assigns.filter_params

    bill_success_path =
      Routes.billing_period_show_path(
        socket,
        :show,
        Map.get(params, "id"),
        socket.assigns.clean_params
      )

    assign(socket, :bill_success_path, bill_success_path)
  end

  defp assign_member(socket, params) do
    with {:ok, member_id} <- Map.fetch(params, "member_id"),
         member <- Members.get_member!(member_id) do
      assign(socket, :member, member)
    else
      _catch ->
        assign(socket, :member, nil)
    end
  end

  defp assign_bill(socket, live_action, params) when live_action == :edit_bill do
    bill =
      params
      |> Map.fetch!("bill_id")
      |> Bills.get_bill_by_id()

    assign(socket, :bill, bill)
  end

  defp assign_bill(socket, _live_action, _params) do
    case Map.fetch(socket.assigns, :member) do
      {:ok, member} when not is_nil(member) ->
        bill =
          Bills.new_bill(%{
            member_id: member.id,
            user_id: socket.assigns.current_users.id
          })

        assign(socket, :bill, bill)

      _else ->
        assign(socket, :bill, nil)
    end
  end
end
