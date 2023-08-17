defmodule GuimbalWaterworksWeb.MemberLive.ListComponent do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Bills

  @default_search_params %{
    "first_name" => "",
    "middle_name" => "",
    "last_name" => "",
    "unique_identifier" => "",
    "street" => "",
    "type" => "all"
  }

  @impl true
  def update(assigns, socket) do
    search_params =
      if Map.has_key?(assigns, :search_params) do
        assigns.search_params
      else
        @default_search_params
      end

    base_params = %{
      "preload" => [bills: bill_preload_query()]
    }

    {:ok, 
      socket
      |> assign(assigns)
      |> assign(:base_params, base_params)
      |> assign_search_params(search_params)
      |> assign_members()
    }
  end

  @impl true

  def handle_event("filter_change", %{ "search_params" => search_params }, socket) do
    {:noreply,
      socket
      |> assign_search_params(search_params)
      |> assign_members()
    }
  end

  defp assign_search_params(socket, search_params) do
    assign(socket, :search_params, search_params)
  end

  defp assign_members(%{
    assigns: %{
      base_params: base_params,
      search_params: search_params
    }
  } = socket) do
    search_params_with_values =
      search_params
      |> Enum.filter(
        fn {_key, value} ->
          not is_nil(value) and value !== ""
        end
      )
      |> Map.new()

    list_params = Map.merge(base_params, search_params_with_values)

    members = Members.list_members(list_params) 

    assign(socket, :members, members) 
  end

  defp bill_preload_query do
    Bills.query_bill(%{
      "limit" => 2,
      "order_by" => [desc: :inserted_at],
      "preload" => [:billing_period]
    })
  end
end
