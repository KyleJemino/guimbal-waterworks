defmodule GuimbalWaterworksWeb.BillingPeriodLive.FormComponent do
  use GuimbalWaterworksWeb, :live_component
  alias Ecto.Changeset

  alias GuimbalWaterworks.Bills
  alias Bills.BillingPeriod

  @impl true
  def mount(socket) do
    rates =
      Bills.list_rates(%{
        "limit" => 5,
        "order_by" => "default",
        "select" => [:id, :title]
      })

    rate_options = Enum.map(rates, &{&1.title, &1.id})

    {:ok, assign(socket, rate_options: rate_options, initial: true)}
  end

  @impl true
  def update(%{billing_period: billing_period} = assigns, %{assigns: %{initial: true}} = socket) do
    changeset = Bills.change_billing_period(billing_period)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(
       changeset: changeset,
       original_billing_period: billing_period,
       initial: false
     )}
  end

  @impl true
  def update(%{billing_period: billing_period} = assigns, socket) do
    changeset = Bills.change_billing_period(billing_period)

    {:ok,
     socket
     |> assign(assigns)
     |> assign(:changeset, changeset)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="form-modal-container">
      <h2 class="text-center"><%= @title %></h2>

      <.form
        let={f}
        for={@changeset}
        id="billing_period-form"
        phx-target={@myself}
        phx-change="validate"
        phx-submit="save"
        class="form-component"
        >

        <div class="flex flex-row gap-4">
        <div class="field-group w-1/2">
          <%= label f, :month %>
          <%= select f, :month, GuimbalWaterworks.Constants.months(), [prompt: "Choose a month"] %>
          <%= error_tag f, :month %>
        </div>

        <div class="field-group w-1/2">
          <%= label f, :year %>
          <%= text_input f, :year %>
          <%= error_tag f, :year %>
        </div>
        </div>

        <div class="flex flex-row gap-4">
        <div class="field-group w-1/2">
          <%= label f, :from %>
          <div class="date-input">
          <%= date_input f, :from, class: "w-full" %>
          </div>
          <%= error_tag f, :from %>
        </div>

        <div class="field-group w-1/2">
          <%= label f, :to %>
          <div class="date-input">
            <%= date_input f, :to , class: "w-full"%>
          </div>
          <%= error_tag f, :to %>
        </div>
        </div>

        <div class="flex flex-row gap-4">
        <div class="field-group w-1/2">
          <%= label f, :due_date %>
          <%= date_input f, :due_date, class: "w-full" %>
          <%= error_tag f, :due_date %>
        </div>
        <div class="field-group w-1/2">
          <%= label f, :rate_id %>
          <%= select(
            f,
            :rate_id,
            @rate_options,
            required: true
          )%>
          <%= error_tag f, :rate_id %>
        </div>
        </div>

        <div class="field-group flex flex-col items-center">
        <%= label f, :death_aid_recipients, class: "!text-2xl font-bold text-center mb-3" %>

          <%= for {recipient_form, index} <- inputs_for(f, :death_aid_recipients) |> Enum.with_index() do %>
          <div class="flex flex-row items-center gap-2">
            <%= hidden_input recipient_form, :id %>
            <%= label recipient_form, :name %>
            <%= text_input recipient_form, :name %>
            <button
              phx-target={@myself}
              phx-click="delete-recipient"
              phx-value-index={index}
              type="button"
              class="button -icon bg-blue-200 px-4"
              > x </button>
          </div>
        <% end %>

        <button
          phx-target={@myself}
          phx-click="add-recipient"
          type="button"
          class="button max-w-[160px] bg-blue-200 text-md font-medium p-3"
        >Add recipient</button>
        </div>

        <div class="form-button-group mt-3">
        <%= submit "Save", phx_disable_with: "Saving...", class: "submit" %>
        </div>
      </.form>
    </div>
    """
  end

  @impl true
  def handle_event("validate", %{"billing_period" => billing_period_params}, socket) do
    changeset =
      socket.assigns.billing_period
      |> Bills.change_billing_period(billing_period_params)
      |> Map.put(:action, :validate)

    {:noreply,
     assign(socket,
       changeset: changeset,
       billing_period: Changeset.apply_changes(changeset)
     )}
  end

  def handle_event("save", %{"billing_period" => billing_period_params}, socket) do
    save_billing_period(socket, socket.assigns.action, billing_period_params)
  end

  def handle_event("add-recipient", _, socket) do
    current_changeset = Bills.change_billing_period(socket.assigns.billing_period)

    current_recipients =
      current_changeset
      |> Changeset.get_embed(:death_aid_recipients)
      |> Enum.map(&Map.from_struct(&1.data))

    new_billing_period = %{
      id: Ecto.UUID.generate(),
      name: ""
    }

    billing_period =
      current_changeset
      |> Changeset.put_embed(
        :death_aid_recipients,
        current_recipients ++ [new_billing_period]
      )
      |> Changeset.apply_changes()

    changeset = Bills.change_billing_period(billing_period)

    {:noreply, assign(socket, changeset: changeset, billing_period: billing_period)}
  end

  def handle_event("delete-recipient", %{"index" => index}, socket) do
    current_changeset = socket.assigns.changeset
    index = String.to_integer(index)

    updated_recipients =
      current_changeset
      |> Changeset.get_embed(:death_aid_recipients)
      |> Enum.with_index()
      |> Enum.reject(fn {_recipient_changeset, param_index} ->
        param_index == index
      end)
      |> Enum.map(fn {changeset, _} -> Map.from_struct(changeset.data) end)

    recipient_params = %{
      "death_aid_recipients" => updated_recipients
    }

    billing_period =
      socket.assigns.billing_period
      |> Changeset.cast(recipient_params, [])
      |> Changeset.cast_embed(
        :death_aid_recipients,
        with: &BillingPeriod.death_aid_recipient_changeset/2
      )
      |> Changeset.apply_changes()

    changeset = Bills.change_billing_period(billing_period)

    {:noreply, assign(socket, changeset: changeset, billing_period: billing_period)}
  end

  defp save_billing_period(socket, :edit, billing_period_params) do
    billing_period_params =
      Map.update(billing_period_params, "death_aid_recipients", [], fn
        recipients when is_map(recipients) and map_size(recipients) > 0 ->
          recipients

        _val ->
          []
      end)

    case Bills.update_billing_period(
           socket.assigns.original_billing_period,
           billing_period_params
         ) do
      {:ok, _billing_period} ->
        {:noreply,
         socket
         |> put_flash(:info, "Billing period updated successfully")
         |> push_redirect(to: socket.assigns.return_to)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, :changeset, changeset)}
    end
  end

  defp save_billing_period(socket, :new, billing_period_params) do
    case Bills.create_billing_period(billing_period_params) do
      {:ok, _billing_period} ->
        {:noreply,
         socket
         |> put_flash(:info, "Billing period created successfully")
         |> push_redirect(to: socket.assigns.return_to)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign(socket, changeset: changeset)}
    end
  end
end
