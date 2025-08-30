defmodule GuimbalWaterworksWeb.MemberLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Members.Member
  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.Payment

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply,
     socket
     |> apply_action(socket.assigns.live_action, params)
     |> assign_payment(socket.assigns.live_action, params)
     |> assign(:filter_params, Map.drop(params, ["id"]))}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit Member")
    |> assign(:member, Members.get_member!(id))
    |> assign(:bill, nil)
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "New Member")
    |> assign(:member, %Member{})
    |> assign(:bill, nil)
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Listing Members")
    |> assign(:member, nil)
    |> assign(:bill, nil)
  end

  defp apply_action(socket, :new_bill, %{"id" => id}) do
    member = Members.get_member!(id)

    bill =
      Bills.new_bill(%{
        member_id: member.id,
        user_id: socket.assigns.current_users.id
      })

    socket
    |> assign(:member, member)
    |> assign(:page_title, "New Bill for #{Display.full_name(member)}")
    |> assign(:bill, bill)
  end

  defp apply_action(socket, :payment, %{"id" => id}) do
    member = Members.get_member!(id)

    socket
    |> assign(:page_title, "Pay Bills for #{Display.full_name(member)}")
    |> assign(:member, member)
    |> assign(:bill, nil)
  end

  defp apply_action(socket, :disconnection_form, _params) do
    socket
    |> assign(:page_title, "Generate Disconnection Sheet")
    |> assign(:member, nil)
    |> assign(:bill, nil)
  end

  defp assign_payment(socket, :payment, %{"id" => member_id}) do
    assign(
      socket,
      :payment,
      %Payment{
        member_id: member_id,
        user_id: socket.assigns.current_users.id,
        bill_ids: ""
      }
    )
  end

  defp assign_payment(socket, _action, _params), do: assign(socket, :payment, nil)

  @impl true
  def handle_event("archive", %{"id" => id}, socket) do
    member = Members.get_member!(id)

    case Members.archive_member(member) do
      {:ok, _member} ->
        {:noreply,
         socket
         |> put_flash(:info, "User deleted")}

      _ ->
        {:noreply, put_flash(socket, :error, "Something went wrong")}
    end
  end

  @impl true
  def handle_event("unarchive", %{"id" => id}, socket) do
    member = Members.get_member!(id)

    case Members.unarchive_member(member) do
      {:ok, _member} ->
        {:noreply,
         socket
         |> put_flash(:info, "User restored")}

      _ ->
        {:noreply, put_flash(socket, :error, "Something went wrong")}
    end
  end
end
