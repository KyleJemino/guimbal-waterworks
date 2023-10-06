defmodule GuimbalWaterworksWeb.MemberLive.Components do
  use GuimbalWaterworksWeb, :component

  def bill_card(assigns) do
    ~H"""
      <div class="bill-card">
        <div class="bill-header">
          <img src={@bill_logo_src} class="logo"/>
          <div class="header-text">
            <p>Guimbal BWP-Rural Waterworks and Sanitation Association</p> 
            <p>Poblacion, Guimbal</p>
            <p class="contact">Contact #: 09778039982 / (033) 517-4642</p>
          </div>
        </div>
        <p><%= Display.full_name(@member) %></p>
        <p><%= Display.money(@bill_map.total) %></p>
      </div>
    """
  end
end
