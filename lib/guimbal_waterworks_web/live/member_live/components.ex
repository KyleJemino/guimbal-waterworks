defmodule GuimbalWaterworksWeb.MemberLive.Components do
  use GuimbalWaterworksWeb, :component

  def bill_card(assigns) do
    ~H"""
      <div class="flex flex-row gap-4">
        <p><%= Display.full_name(@member) %></p>
        <p><%= Display.money(@bill_map.total) %></p>
      </div>
    """
  end
end
