defmodule GuimbalWaterworksWeb.PaginationHelpers do
  use GuimbalWaterworksWeb, :component

  @default_pagination_params %{
    "per_page" => 20,
    "current_page" => 1
  }

  def default_pagination_params, do: @default_pagination_params

  def sanitize_pagination_params(%{
    "per_page" => limit,
    "current_page" => _current_page
  } = params) when limit != "All" do
    maybe_to_int = fn val ->
      if is_binary(val) do
        String.to_integer(val)
      else
        val
      end
    end

    params
    |> Map.update!("per_page", maybe_to_int)
    |> Map.update!("current_page", maybe_to_int)
  end

  def sanitize_pagination_params(params), do: params

  def pagination_to_query_params(%{
        "per_page" => limit,
        "current_page" => current_page
      } = params) do
    pagination_query_params =
      if limit != "All" do
        %{
          "limit" => limit,
          "offset" => limit * (current_page - 1)
        }
      else
        %{}
      end
    params
    |> Map.drop(["per_page", "current_page"])
    |> Map.merge(pagination_query_params)
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

  def pagination_buttons(assigns) do
    ~H"""
    <div class="pagination-buttons-container">
      <div class="pagination">
        <%= if @pagination_params["current_page"] not in [1, "1"] do %>
          <button
            class="button"
            phx-target={@target}
            phx-click="turn_page"
            phx-value-page={@pagination_params["current_page"] - 1}
          >
            Prev
          </button>
        <% end %>
        <div class="spacer"></div> 
        <%= for chunk <- @pagination.pagination_chunks do %>
          <%= if chunk != List.first(@pagination.pagination_chunks) do %>
            <span>..</span>
          <% end %>
          <%= for page <- chunk do %>
            <button
              class={
                "button -page #{if page == @pagination_params["current_page"], do: "-active"}"
              }
              phx-target={@target}
              phx-click="turn_page"
              phx-value-page={page}
            >
              <%= page %>
            </button>
          <% end %>
        <% end %>
        <div class="spacer"></div> 
        <%= if @pagination_params["current_page"] < @pagination.pages_count do %>
          <button
            class="button"
            phx-target={@target}
            phx-click="turn_page"
            phx-value-page={@pagination_params["current_page"] + 1}
          >
            Next
          </button>
        <% end %>
      </div>
    </div>
    """
  end

  def pagination_count_select(assigns) do
    ~H"""
      <.form
        let={f}
        for={:pagination_params}
        id="pagination-info-form"
        phx-target={@target}
        phx-change="per_page_change"
        class="pagination-info-container"
      >
        <div>
          <span>Show per page</span>
          <%= select( 
            f, 
            :per_page, 
            ["All" | Enum.to_list(10..100//10)], 
            required: true,
            value: @pagination_params["per_page"]
          )%>
        </div>
        <p>
          Displaying <strong><%= @pagination.display_count %></strong> results of <strong><%= @pagination.total_count %></strong>
        </p>
      </.form>
    """
  end
end
