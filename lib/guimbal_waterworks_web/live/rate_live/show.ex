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
        rate.usage_rates,
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
end
