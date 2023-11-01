defmodule GuimbalWaterworksWeb.RateLive.Upload do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Bills

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> allow_upload(:excel, accept: [".xlsx"], max_entries: 1)
     |> assign(:error_message, nil)}
  end

  @impl true
  def handle_event("validate", _params, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_event("save", _params, socket) do
    case save_rate_data(socket) do
      {:ok, rate} ->
        {:noreply,
         socket
         |> put_flash(:info, "Rate uploaded")
         |> push_redirect(to: Routes.rate_show_path(socket, :show, rate))}

      {:error, _changeset} ->
        {:noreply, assign(socket, :error_message, "Invalid rate data")}
    end
  end

  defp save_rate_data(socket) do
    [rate_attrs] =
      consume_uploaded_entries(socket, :excel, fn %{path: path}, _entry ->
        [_headers | raw_data] =
          path
          |> Xlsxir.stream_list(0)
          |> Enum.to_list()

        [
          title,
          _reading,
          _personal_rate,
          _business_rate,
          tax_rate,
          reconnection_fee,
          membership_fee,
          surcharge_fee
        ] = Enum.at(raw_data, 0)

        usage_rate_map =
          Enum.reduce(raw_data, %{}, fn [_title, reading, personal_rate, business_rate | _tail],
                                        usage_rate_map ->
            reading_rates = %{
              personal: personal_rate,
              business: business_rate
            }

            Map.put(usage_rate_map, "#{reading}", reading_rates)
          end)

        rate_attrs = %{
          title: title,
          reconnection_fee: reconnection_fee,
          membership_fee: membership_fee,
          surcharge_fee: surcharge_fee,
          tax_rate: tax_rate,
          usage_rates: usage_rate_map
        }
      end)

    Bills.create_rate(rate_attrs)
  end
end
