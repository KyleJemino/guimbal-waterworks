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

  def render(assigns) do
    ~H"""
    <div class="page-container flex flex-col justify-center items-center">
      <h1 class="text-center">Upload Rate Excel Sheet</h1>
      <form
        id="upload-form"
        phx-change="validate"
        phx-submit="save"
        class="form-component max-w-[560px] mt-9"
      >
        <%= live_file_input @uploads.excel %>
        <%= if @error_message do %>
          <div class="alert alert-danger mt-3">
            <p><%= @error_message %></p>
          </div>
        <% end %>
        <div class="form-button-group">
          <button type="submit" class="submit">Upload</button>
        </div>
      </form>
    </div>
    """
  end

  defp save_rate_data(socket) do
    [rate_attrs] =
      consume_uploaded_entries(socket, :excel, fn %{path: path}, _entry ->
        [_headers | raw_data] =
          path
          |> Xlsxir.extract(0)
          |> then(&(elem(&1, 1)))
          |> Xlsxir.get_list()

        [
          title,
          _reading,
          _personal_prices,
          business_rate,
          tax_rate,
          _reconnection_fees,
          membership_fee,
          surcharge_fee,
          _discount_rates
        ] = Enum.at(raw_data, 0)

        personal_price_map =
          Enum.reduce(raw_data, %{}, fn [_title, reading, personal_rate | _tail],
                                        personal_price_map ->
            Map.put(personal_price_map, "#{reading}", Decimal.new("#{personal_rate}"))
          end)

        reconnection_fees =
          raw_data
          |> Enum.reduce([], fn row, acc ->
            raw_fee = Enum.at(row, 5)

            case Decimal.parse("#{raw_fee}") do
              {%Decimal{}= reconnection_fee, _} -> [reconnection_fee | acc]
              :error -> acc
            end
          end)
          |> Enum.uniq()
          |> Enum.sort(&(Decimal.gt?(&1, &2)))

        discount_rates =
          raw_data
          |> Enum.reduce([], fn row, acc ->
            raw_rate = Enum.at(row, 8)

            case Decimal.parse("#{raw_rate}") do
              {%Decimal{}= raw_rate, _} -> [raw_rate | acc]
              :error -> acc
            end
          end)
          |> Enum.uniq()
          |> Enum.sort(&(Decimal.gt?(&1, &2)))

        %{
          title: title,
          reconnection_fees: reconnection_fees,
          membership_fee: membership_fee,
          surcharge_fee: surcharge_fee,
          tax_rate: tax_rate,
          personal_prices: personal_price_map,
          business_rate: business_rate,
          discount_rates: discount_rates
        }
      end)

    Bills.create_rate(rate_attrs)
  end
end
