defmodule GuimbalWaterworksWeb.MemberLive.Show do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Bills

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign_new(socket, :show_info?, fn -> true end)}
  end

  @impl true
  def handle_params(%{"id" => id} = params, _, socket) do
    member = Members.get_member!(id)

    bill =
      Bills.new_bill(%{
        member_id: member.id,
        user_id: socket.assigns.current_users.id
      })

    {:noreply,
     socket
     |> assign(:page_title, page_title(socket.assigns.live_action))
     |> assign(:member, member)
     |> assign(:bill, bill)
     |> assign(:filter_params, params)
     |> assign(:clean_params, Map.drop(params, ["id"]))}
  end

  @impl true
  def handle_event("show_info", _value, socket) do
    {:noreply, assign(socket, :show_info?, true)}
  end

  @impl true
  def handle_event("hide_info", _value, socket) do
    {:noreply, assign(socket, :show_info?, false)}
  end

  defp page_title(:edit), do: "Edit Member"
  defp page_title(:new_bill), do: "Create Bill"
  defp page_title(_action), do: "Show Member"
end
