defmodule GuimbalWaterworksWeb.Components.SharedComponents do
  use Phoenix.Component
  use Phoenix.HTML

  def render_for_roles(assigns) do
    ~H"""
    <%= if Enum.member?(@roles, @user.role) or @user.role === :manager do %>
      <%= render_slot(@inner_block) %>
    <% end %>
    """
  end
end
