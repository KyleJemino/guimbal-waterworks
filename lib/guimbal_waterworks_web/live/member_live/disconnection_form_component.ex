defmodule GuimbalWaterworksWeb.MemberLive.DisconnectionFormComponent do
  use GuimbalWaterworksWeb, :live_component
  import Ecto.Changeset
  alias GuimbalWaterworks.Constants
  alias GuimbalWaterworks.Members
  alias GuimbalWaterworksWeb.MemberLive.Helpers, as: MLHelpers

  @types %{
    street: :string
  }

  defstruct [
    :street
  ]

  @impl true
  def update(assigns, socket) do
    changeset = form_changeset(%__MODULE__{}, %{})

    {:ok, 
      socket
      |> assign(assigns)
      |> assign(:changeset, changeset)
    }
  end

  @impl true
  def handle_event("validate", %{"filter_params" => params}, socket) do
    changeset = validate_params(params)

    {:noreply, assign(socket, :changeset, changeset)}
  end

  @impl true
  def handle_event("create_sheet", %{"filter_params" => filter_params}, socket) do
    changeset = validate_params(filter_params)

    if changeset.valid? do
      street = filter_params["street"]

      {rows, period_headers} = 
        filter_params
        |> Map.merge(%{
          "preload" => [bills: MLHelpers.unpaid_bill_preload_query()],
          "order_by" => [
            asc: :last_name,
            asc: :first_name,
            asc: :middle_name,
            asc: :unique_identifier
          ],
          "status" => "for_disconnection"
        })
        |> Members.list_members()
        |> MLHelpers.build_disconnection_map(street)

      {:noreply, 
        push_event(
          socket, 
          "generate-disconnection", 
          %{
            rows: rows,
            period_headers: period_headers,
            street: street
          }
        )
      }
    else
      {:noreply, assign(socket, :changeset, changeset)}

    end
  end

  defp form_changeset(%__MODULE__{} = form, attrs) do
    {form, @types}
    |> cast(attrs, Map.keys(@types))
    |> validate_required(:street)
    |> validate_inclusion(:street, Constants.streets())
  end

  defp validate_params(params) do
    %__MODULE__{}
    |> form_changeset(params)
    |> Map.put(:action, :validate)
  end
end
