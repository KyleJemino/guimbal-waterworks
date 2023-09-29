defmodule GuimbalWaterworksWeb.MemberLive.Print do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Bills

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def handle_params(params, _uri, socket) do
    {:noreply, socket}
  end
end
