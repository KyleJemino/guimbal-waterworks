defmodule GuimbalWaterworksWeb.BillLive.Components do
  use GuimbalWaterworksWeb, :component

  def filter_form(assigns) do
    ~H"""
    <.form
      let={f}
      for={:search_params}
      id="search-form"
      phx-target={@target}
      phx-change="filter_change"
      phx-submit="filter_submit"
      class="filter-form container max-w-[unset]"
    >
      <div class="fields">
        <%= if @for == :billing_period do %>
          <div class="search-input-group">
            <%= label f, :last_name %>
            <%= text_input f, :last_name, value: @search_params["last_name"] %>
          </div>
          <div class="search-input-group">
            <%= label f, :first_name %>
            <%= text_input f, :first_name, value: @search_params["first_name"] %>
          </div>
          <div class="search-input-group">
            <%= label f, :middle_name %>
            <%= text_input f, :middle_name, value: @search_params["middle_name"] %>
          </div>
          <div class="search-input-group">
            <%= label f, :street %>
            <%= select( 
              f, 
              :street, 
              ["All" | GuimbalWaterworks.Constants.streets()], 
              value: @search_params["street"]
            )%>
          </div>
          <div class="search-input-group">
            <%= label f, :type %>
            <%= select( 
              f, 
              :type, 
              ["All": :all, "Personal": :personal, "Business": :business], 
              required: true,
              value: @search_params["type"]
            )%>
          </div>
        <% end %>
        <%= if @for == :member do %>
          <div class="search-input-group">
            <%= label f, :due_from %>
            <%= date_input f, :due_from, value: @search_params["due_from"] %>
          </div>
          <div class="search-input-group">
            <%= label f, :due_to %>
            <%= date_input f, :due_to, value: @search_params["due_to"] %>
          </div>
        <% end %>
        <div class="search-input-group">
          <%= label f, :status %>
          <%= select( 
            f, 
            :status, 
            [All: :all, Paid: :paid, Unpaid: :unpaid], 
            required: true,
            value: @search_params["status"]
          )%>
        </div>
      </div>
      <div class="submit-container">
        <%= submit "Search", phx_disable_with: "Saving...", class: "button -dark w-1/3" %>
      </div>
    </.form>
    """
  end
end
