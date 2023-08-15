defmodule GuimbalWaterworksWeb.MemberLive.ListComponent do
  use GuimbalWaterworksWeb, :live_component

  alias GuimbalWaterworks.Members

  @default_search_params %{
    "first_name" => "",
    "middle_name" => "",
    "last_name" => "",
    "unique_identifier" => nil,
    "street" => "",
    "type" => :all
  }

  @impl true
  def update(assigns, socket) do
    search_params =
      if Map.has_key?(assigns, :search_params) do
        assigns.search_params
      else
        @default_search_params
      end

    {:ok, 
      socket
      |> assign(assigns)
      |> assign(:base_params, %{})
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
          not is_nil(value) or value !== ""
        end
      )
      |> Map.new()

    list_params = Map.merge(base_params, search_params_with_values)

    assign(socket, :members, Members.list_members(list_params)) 
  end
end
