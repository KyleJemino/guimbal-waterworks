defmodule GuimbalWaterworksWeb.MemberLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Members.Member
  alias GuimbalWaterworks.Bills

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
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
end
