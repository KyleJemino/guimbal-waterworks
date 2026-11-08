defmodule GuimbalWaterworksWeb.MemberLive.Show do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Members
  alias GuimbalWaterworks.Bills

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign_new(socket, :show_info?, fn -> true end)}
  end

  @impl true
  def handle_params(%{"id" => id} = params, _, socket) do
    member = Members.get_member!(id)

    bill =
      case Map.fetch(params, "bill_id") do
        {:ok, bill_id} ->
          Bills.get_bill_by_id(bill_id)

        _else ->
          Bills.new_bill(%{
            member_id: member.id,
            user_id: socket.assigns.current_users.id
          })
      end

    clean_params = Map.drop(params, ["id", "bill_id"])

    {:noreply,
     socket
     |> assign(:page_title, page_title(socket.assigns.live_action))
     |> assign(:member, member)
     |> assign(:bill, bill)
     |> assign(:filter_params, params)
     |> assign(:clean_params, clean_params)
     |> assign(
       :current_member_show_path,
       Routes.member_show_path(socket, :show, member, clean_params)
     )}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <%= if @live_action in [:edit] do %>
      <.modal return_to={@current_member_show_path}>
        <.live_component
          module={GuimbalWaterworksWeb.MemberLive.FormComponent}
          id={@member.id}
          title={@page_title}
          action={@live_action}
          member={@member}
          return_to={@current_member_show_path}
        />
      </.modal>
    <% end %>

    <SC.render_for_roles roles={[:admin]} user={@current_users}>
      <%= if @live_action in [:new_bill] do %>
        <.modal return_to={@current_member_show_path}>
          <.live_component
            module={GuimbalWaterworksWeb.BillLive.FormComponent}
            id={@bill.id || :new}
            title={"New Bill for #{Display.full_name(@member)}"}
            action={:new}
            bill={@bill}
            return_to={@current_member_show_path}
            success_path={@current_member_show_path}
          />
        </.modal>
      <% end %>
      <%= if @live_action in [:edit_bill] do %>
        <.modal return_to={@current_member_show_path}>
          <.live_component
            module={GuimbalWaterworksWeb.BillLive.FormComponent}
            id={@bill.id}
            title={"New Bill for #{Display.full_name(@member)}"}
            action={:edit}
            bill={@bill}
            return_to={@current_member_show_path}
            success_path={@current_member_show_path}
          />
        </.modal>
      <% end %>
    </SC.render_for_roles>

    <SC.render_for_roles roles={[:cashier]} user={@current_users}>
      <%= if @live_action == :history_form do %>
        <.modal return_to={@current_member_show_path}>
          <.live_component
            module={GuimbalWaterworksWeb.MemberLive.HistoryFormComponent}
            id={:history_form}
            title="Choose years to show"
            member_id={@member.id}
          />
        </.modal>
      <% end %>
    </SC.render_for_roles>


    <div class="page-container">
      <h1><%= Display.full_name(@member) %></h1>

      <div class="page-button-container mt-3">
        <%= live_redirect "Back", to: Routes.member_index_path(@socket, :index), class: "button -dark" %>
        <SC.render_for_roles roles={[:admin]} user={@current_users}>
          <%= live_patch "Edit", to: Routes.member_show_path(@socket, :edit, @member, @clean_params), class: "button -dark" %>
          <%= live_patch "Create Bill", to: Routes.member_show_path(@socket, :new_bill, @member, @clean_params), class: "button -dark" %>
        </SC.render_for_roles>
        <SC.render_for_roles roles={[:cashier]} user={@current_users}>
          <%= live_patch "Print Payment History", to: Routes.member_show_path(@socket, :history_form, @member, @clean_params), class: "button -dark" %>
        </SC.render_for_roles>
        <%= if @show_info? do %>
          <button phx-click="hide_info" class="button -caution">Hide Info</button>
        <% else %>
          <button phx-click="show_info" class="button -dark">Show Info</button>
        <% end %>
      </div>

      <%= if @show_info? do %>
        <table class="data-table mt-3">
          <tr class="header-row">
            <th class="header">Street</th>
            <th class="header">Type</th>
            <th class="header">Meter no</th>
            <th class="header">Account no</th>
          </tr>
          <tr class="data-row">
            <td class="data"><%= @member.street %></td>
            <td class="data"><%= @member.type %></td>
            <td class="data text-right"><%= @member.meter_no %></td>
            <td class="data text-right"><%= @member.account_no %></td>
          </tr>
        </table>
      <% end %>

      <div class="page-table">
        <div class="table-selection">
          <%= live_patch "Bills", to: Routes.member_show_path(@socket, :show, @member), class: "button#{Display.active_class?([:show, :edit, :new_bill], @live_action)}" %>
          <%= live_patch "Payments", to: Routes.member_show_path(@socket, :payments, @member), class: "button#{Display.active_class?([:payments], @live_action)}" %>
        </div>
        <div class="table-container">
          <%= if @live_action in [:payments] do %>
            <.live_component
             module={GuimbalWaterworksWeb.PaymentLive.PaymentList}
             for={:member}
             id={:payment_list}
             base_params={%{
             "member_id" => @member.id
             }}
             filter_params={@filter_params}
             current_users={@current_users}
             />
           <% end %>
           <%= if @live_action in [:new_bill, :show, :edit, :edit_bill] do %>
             <.live_component
             module={GuimbalWaterworksWeb.BillLive.BillList}
             for={:member}
             id={:bill_list}
             base_params={%{
             "member_id" => @member.id
             }}
             filter_params={@filter_params}
             edit_event_name={:edit_bill}
             current_users={@current_users}
             />
           <% end %>
        </div>
      </div>
    </div>
    """
  end

  @impl true
  def handle_event("show_info", _value, socket) do
    {:noreply, assign(socket, :show_info?, true)}
  end

  @impl true
  def handle_event("hide_info", _value, socket) do
    {:noreply, assign(socket, :show_info?, false)}
  end

  @impl true
  def handle_info({:edit_bill, bill_id}, socket) do
    %{
      clean_params: clean_params,
      member: member
    } = socket.assigns

    edit_bill_path =
      Routes.member_show_path(
        socket,
        :edit_bill,
        member,
        bill_id,
        clean_params
      )

    {:noreply, push_patch(socket, to: edit_bill_path)}
  end

  defp page_title(:edit), do: "Edit Member"
  defp page_title(:new_bill), do: "Create Bill"
  defp page_title(_action), do: "Show Member"
end
