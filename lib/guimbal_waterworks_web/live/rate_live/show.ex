defmodule GuimbalWaterworksWeb.RateLive.Show do
  use GuimbalWaterworksWeb, :live_view

  require Decimal
  alias GuimbalWaterworks.Bills

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  @impl true
  def handle_params(%{"id" => rate_id}, _url, socket) do
    rate = Bills.get_rate(%{"id" => rate_id})

    personal_prices = sort_price_map(rate.personal_prices)

    {:noreply,
     assign(socket, %{
       rate: rate,
       personal_prices: personal_prices,
       show_business_column?: is_map(rate.business_prices)
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
        <li>Tax Rate: <%= Display.percent(@rate.tax_rate) %></li>
        <%= if not(@show_business_column?) do %>
          <li>Business Rate: <%= "#{@rate.business_rate}" %></li>
        <% end %>
        <li>Discount Rates: <%= render_rates(@rate.discount_rates) %></li>
      </ul>
      <h3 class="mt-6">Personal Prices</h3>
      <table class="data-table mt-3">
        <tr class="header-row">
          <th class="header">Usage</th>
          <th class="header">Personal</th>
          <%= if @show_business_column? do %>
            <th class="header">Business</th>
          <% end %>
        </tr>
        <%= for {usage, price} <- @personal_prices do %>
          <tr class="data-row">
            <td class="data text-center"><%= usage %></td>
            <td class="data text-right"><%= Display.money(price) %></td>
            <%= if @show_business_column? do %>
              <td class="data text-right"><%= display_business_price(@rate, usage) %></td>
            <% end %>
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

  def render_rates(rates) do
    rates
    |> Enum.map(&Display.percent/1)
    |> Enum.join(", ")
  end

  defp sort_price_map(price_map) do
    Enum.sort(
      price_map,
      fn first, last ->
        {usage1, _rates} = first
        {usage2, _rates} = last

        String.to_integer(usage1) <= String.to_integer(usage2)
      end
    )
  end

  defp display_business_price(rate, usage) do
    rate.business_prices
    |> Map.get(usage)
    |> Display.money()
  end
end
