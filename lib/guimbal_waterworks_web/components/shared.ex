defmodule GuimbalWaterworksWeb.Components.SharedComponents do
  use Phoenix.Component
  use Phoenix.HTML
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
end
