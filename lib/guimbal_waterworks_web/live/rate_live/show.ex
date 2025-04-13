defmodule GuimbalWaterworksWeb.RateLive.Show do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Bills

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => rate_id}, _url, socket) do
    rate = Bills.get_rate(%{"id" => rate_id})

    sorted_rates =
      Enum.sort(
        rate.personal_prices,
        fn first, last ->
          {usage1, _rates} = first
          {usage2, _rates} = last

          String.to_integer(usage1) <= String.to_integer(usage2)
        end
      )

    {:noreply,
     assign(socket, %{
       rate: rate,
       sorted_rates: sorted_rates
     })}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="page-container">
      <h1><%= @rate.title %></h1>
      <ul class="mt-3">
        <li>Membership Fee: <%= Display.money(@rate.membership_fee) %></li>
        <li>Reconnection Fee: <%= render_reconnection_fees(@rate.reconnection_fees) %></li>
        <li>Surcharge Fee: <%= Display.money(@rate.surcharge_fee) %></li>
        <li>Tax Rate: <%= "#{@rate.tax_rate}" %></li>
        <li>Business Rate: <%= "#{@rate.business_rate}" %></li>
      </ul>
      <h3 class="mt-6">Personal Prices</h3>
      <table class="data-table mt-3">
        <tr class="header-row">
          <th class="header">Usage</th>
          <th class="header">Personal</th>
        </tr>
        <%= for {usage, price} <- @sorted_rates do %>
          <tr class="data-row">
            <td class="data text-center"><%= usage %></td>
            <td class="data text-right"><%= Display.money(price) %></td>
          </tr>
        <% end %>
      </table>
    </div>
    """
  end

  def render_reconnection_fees(reconnection_fees) do
    reconnection_fees
    |> Enum.map(&Display.money/1)
    |> Enum.join(", ")
  end
end
