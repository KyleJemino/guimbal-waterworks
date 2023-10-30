defmodule GuimbalWaterworksWeb.RateLive.Upload do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Bills.Rate

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
      socket
      |> allow_upload(:excel, accept: [".xlsx"], max_entries: 1)
    }
  end

  @impl true
  def handle_event("validate", _params, socket) do
    {:noreply, socket}
  end

  @impl true
  def handle_event("save", _params, socket) do
    raw_rate_data =
      consume_uploaded_entries(socket, :excel, fn %{path: path}, _entry ->
        raw_data =
          path
          |> Xlsxir.stream_list(0)
          |> Enum.to_list()

        IO.inspect raw_data
        {:ok, %{}}
      end)

    {:noreply, socket}
  end
end
