defmodule GuimbalWaterworksWeb.MemberLive.DisconnectionFormComponent do
  use GuimbalWaterworksWeb, :live_component
  import Ecto.Changeset
  alias GuimbalWaterworks.Constants

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
    changeset =
      %__MODULE__{}
      |> form_changeset(params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :changeset, changeset)}
  end

  @impl true
  def handle_event("create_sheet", _params, socket) do
    {:noreply, 
      push_event(
        socket, 
        "generate-disconnection", 
        %{ msg: "hi" }
      )
    }
  end

  defp form_changeset(%__MODULE__{} = form, attrs) do
    {form, @types}
    |> cast(attrs, Map.keys(@types))
    |> validate_required(:street)
    |> validate_inclusion(:street, Constants.streets())
  end
end
