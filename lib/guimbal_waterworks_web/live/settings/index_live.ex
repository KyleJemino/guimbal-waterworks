defmodule GuimbalWaterworksWeb.Settings.IndexLive do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Settings
  alias GuimbalWaterworks.Settings.Setting

  def mount(_params, _session, socket) do
    setting = get_current_setting()

    changeset =
      Setting.changeset(setting)

    socket =
      assign(socket, %{
        changeset: changeset,
        setting: setting
      })

    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div class="page-container">
      <h1>Application Settings</h1>

      <.form
        let={f}
        for={@changeset}
        id="settings-form"
        phx-change="validate"
        phx-submit="save"
        class="form-component"
      >
        <%= hidden_input f, :id %>

        <div class="field-group">
          <%= label f, :contact_number %>
          <%= text_input f, :contact_number, required: true %>
          <%= error_tag f, :contact_number %>
        </div>

        <div class="field-group">
          <%= label f, :address %>
          <%= text_input f, :address, required: true %>
          <%= error_tag f, :address %>
        </div>

        <div class="form-button-group">
          <%= submit "Save", phx_disable_with: "Saving...", class: "submit" %>
        </div>
      </.form>
    </div>
    """
  end

  def handle_event("validate", %{"setting" => setting_params}, socket) do
    setting = socket.assigns.setting

    changeset =
      setting
      |> Setting.changeset(setting_params)
      |> Map.put(:action, :validate)

    {:noreply, assign(socket, :changeset, changeset)}
  end

  def handle_event("save", %{"setting" => setting_params}, socket) do
    case Settings.create_or_update_setting(setting_params) do
      {:ok, setting} ->
        socket
        |> assign(%{
          setting: setting,
          changeset: Setting.changeset(setting)
        })
        |> put_flash(:info, "Settings saved")

      {:error, changeset} ->
        socket
        |> assign(:changeset, changeset)
        |> put_flash(:error, "Something went wrong")
    end
  end

  defp get_current_setting() do
    case Settings.get_setting() do
      %Setting{} = setting ->
        setting
      nil ->
        %Setting{}
    end
  end
end
