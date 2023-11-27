defmodule GuimbalWaterworksWeb.Components.SharedComponents do
  use Phoenix.Component
  use Phoenix.HTML
  alias Phoenix.LiveView.JS
  alias GuimbalWaterworksWeb.DisplayHelpers, as: Display

  def render_for_roles(assigns) do
    ~H"""
    <%= if Enum.member?(@roles, @user.role) or @user.role === :manager do %>
      <%= render_slot(@inner_block) %>
    <% end %>
    """
  end

  def status_cell(assigns) do
    ~H"""
    <td class={"status-cell -#{Display.status_color(@status)}"}>
      <%= @status %>
    </td>
    """
  end

  def pop_up_menu(assigns) do
    ~H"""
    <div class="pop-up-component">
      <button 
        class="button -filter"
        phx-click={toggle_menu_items(@target_id)}
      >
        Menu
      </button>
      <div 
        class="menu-wrapper"
        id={"menu-container-#{@target_id}"}
        phx-click-away={toggle_menu_items(@target_id)}
      >
        <div class="menu-list">
          <%= render_slot(@inner_block) %>
        </div>
      </div>
    </div>
    """
  end

  def toggle_menu_items(target_id) do
    JS.toggle(to: "#menu-container-#{target_id}")
  end
end
