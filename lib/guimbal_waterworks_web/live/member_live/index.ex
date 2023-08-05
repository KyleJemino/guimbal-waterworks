defmodule GuimbalWaterworksWeb.MemberLive.Index do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Members.Member

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign_members(socket)}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Edit Member")
    |> assign(:member, Members.get_member!(id))
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "New Member")
    |> assign(:member, %Member{})
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Listing Members")
    |> assign(:member, nil)
  end

  @impl true
  def handle_event("archive", %{"id" => id}, socket) do
    member = Members.get_member!(id)

    case Members.archive_member(member) do
      {:ok, _member} ->
        {:noreply,
         socket
         |> put_flash(:info, "User deleted")
         |> assign_members()}

      _ ->
        {:noreply, put_flash(socket, :error, "Something went wrong")}
    end
  end

  defp assign_members(socket) do
    members = Members.list_members()
    assign(socket, :members, members)
  end
end
