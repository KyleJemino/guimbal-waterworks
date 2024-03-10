defmodule GuimbalWaterworksWeb.MemberLive.HistoryFormComponent do
  use GuimbalWaterworksWeb, :live_component
  alias GuimbalWaterworks.Bills
  import Ecto.Changeset

  @types %{
    from_year: :string,
    to_year: :string
  }

  defstruct [:from_year, to_year: Date.utc_today().year]

  @impl true
  def update(assigns, socket) do
    min_year =
      Bills.get_billing_period(%{
        "order_by" => [asc: :due_date],
        "limit" => 1
      })
      |> Map.get(:from)
      |> Map.get(:year)

    max_year =
      Bills.get_billing_period(%{
        "order_by" => [desc: :due_date],
        "limit" => 1
      })
      |> Map.get(:due_date)
      |> Map.get(:year)

    year_options =
      Enum.map(min_year..max_year, &Integer.to_string/1)

    changeset = form_changeset(%__MODULE__{}, %{})

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:year_options, year_options)
     |> assign(:changeset, changeset)}
  end

  @impl true
  def handle_event(
        "validate",
        %{"history_form_component" => params},
        socket
      ) do
    changeset =
      params
      |> form_changeset()
      |> Map.put(:action, :validate)
      |> IO.inspect()

    {:noreply, assign(socket, :changeset, changeset)}
  end

  @impl true
  def handle_event(
        "redirect",
        %{"history_form_component" => params},
        socket
      ) do
    {:noreply,
     push_redirect(
       socket,
       to:
         Routes.member_history_path(
           socket,
           :print,
           socket.assigns.member_id,
           params
         )
     )}
  end

  defp form_changeset(form \\ %__MODULE__{}, params) do
    {form, @types}
    |> cast(params, Map.keys(@types))
    |> validate_format(:from_year, ~r/^\d{4}$/)
    |> validate_format(:to_year, ~r/^\d{4}$/)
    |> validate_from_year_to_year()
  end

  defp validate_from_year_to_year(changeset) do
    from_year = get_field(changeset, :from_year)
    to_year = get_field(changeset, :to_year)

    cond do
      is_nil(from_year) || is_nil(to_year) ->
        changeset

      from_year > to_year ->
        add_error(changeset, :from_year, "From must be before To")

      true ->
        changeset
    end
  end
end
