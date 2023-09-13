defmodule GuimbalWaterworksWeb.PaginationHelpers do
  @default_pagination_params %{
    "per_page" => 20,
    "current_page" => 1
  }

  def default_pagination_params, do: @default_pagination_params

  def pagination_to_query_params(%{
    "per_page" => limit,
    "current_page" => current_page
  }) do
    if limit != "All" do
      %{
        "limit" => limit,
        "offset" => limit * (current_page - 1)
      }
    else
      %{}
    end
  end
end
