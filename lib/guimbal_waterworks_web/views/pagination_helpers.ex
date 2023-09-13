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

  def get_pagination_info(pagination_params, result_count, display_count) do
    %{
      "per_page" => per_page,
      "current_page" => current_page
    } = pagination_params

    pages_count =
      if per_page != "All" and result_count != 0 do
        ceil(result_count / per_page)
      else
        1
      end

    pagination_chunks =
      cond do
        per_page == "All" ->
          []

        pages_count < 10 ->
          [
            Enum.to_list(1..pages_count)
          ]

        current_page < 7 ->
          [
            Enum.to_list(1..10),
            [pages_count - 1, pages_count]
          ]

        current_page > pages_count - 6 ->
          [
            [1, 2],
            Enum.to_list((pages_count - 9)..pages_count)
          ]

        true ->
          [
            [1],
            Enum.to_list((current_page - 4)..(current_page + 4)),
            [pages_count]
          ]
      end
    %{
      total_count: result_count,
      display_count: display_count,
      pages_count: pages_count,
      pagination_chunks: pagination_chunks
    }
  end
end
