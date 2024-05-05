defmodule GuimbalWaterworksWeb.MemberLive.Components do
  use GuimbalWaterworksWeb, :component

  alias GuimbalWaterworks.Bills

  def bill_card(assigns) do
    ~H"""
      <div class="bill-card">
        <div class="bill-header">
          <img src={@bill_logo_src} class="logo"/>
          <div class="header-text">
            <p>Guimbal BWP-Rural Waterworks and Sanitation Association</p> 
            <p>Poblacion, Guimbal</p>
            <p class="contact">Contact #: 09778039982 / (033) 517-4642</p>
          </div>
        </div>
        <div class="bill-content h-auto">
          <h5 class="text-right">
            Date Due: <span class="font-bold"><%= Display.format_date(@latest_bill.billing_period.due_date) %></span>
          </h5>
          <p class="uppercase">
            <span class="mr-2">Name:</span>
            <span class="font-bold"><%= Display.full_name(@member) %></span>
          </p>
          <p class="uppercase">
            <span class="mr-2">Address:</span>
            <span class="font-bold"><%= @member.street %></span>
          </p>
          <div class="grid grid-cols-3 grid-row-2">
            <div>From</div>
            <div>To</div>
            <div>Reading</div>
            <div class="font-bold"><%= Display.format_date(@latest_bill.billing_period.from, "%m/%d/%y") %></div>
            <div class="font-bold"><%= Display.format_date(@latest_bill.billing_period.to, "%m/%d/%y") %></div>
            <div class="font-bold"><%= Bills.get_bill_reading(@latest_bill) %></div>
          </div>
          <div class="grid grid-cols-4 grid-row-2">
            <div>Before</div>
            <div>After</div>
            <div>Discount</div>
            <div>Reading</div>
            <div class="font-bold"><%= @latest_bill.before %> Cu.M.</div>
            <div class="font-bold"><%= @latest_bill.after %> Cu.M.</div>
            <div class="font-bold"><%= @latest_bill.discount %> Cu.M.</div>
            <div class="font-bold"><%= Bills.get_bill_reading(@latest_bill) %> Cu.M.</div>
          </div>
          <p class="text-center mt-2 font-bold uppercase bill-highlight">Price Breakdown</p>
          <div class="flex flex-col">
            <div class="grid grid-cols-2">
            <p><%= Bills.get_bill_reading(@latest_bill) %> Cu.M.</p>
              <p class="text-right"><%= Display.money(@latest_bill_calc.base_amount) %></p>
            </div>
            <div class="grid grid-cols-2">
              <p>
              Franchise Tax (
              <%= 
                @latest_bill.billing_period.rate.tax_rate
                |> Decimal.mult(100)
                |> Number.Percentage.number_to_percentage(precision: 2)
              %>
              )
              </p>
              <p class="text-right"><%= Display.money(@latest_bill_calc.franchise_tax_amount) %></p>
            </div>
            <%= if Decimal.gt?(@latest_bill_calc.death_aid_amount, 0) do %>
              <div class="grid grid-cols-2">
                <p>Death Aid</p>
                <p class="text-right"><%= Display.money(@latest_bill_calc.death_aid_amount) %></p>
              </div>
            <% end %>
            <%= if Decimal.gt?(@latest_bill_calc.membership_amount, 0) do %>
              <div class="grid grid-cols-2">
                <p>Membership Fee</p>
                <p class="text-right"><%= Display.money(@latest_bill_calc.membership_amount) %></p>
              </div>
            <% end %>
            <%= if Decimal.gt?(@latest_bill_calc.reconnection_amount, 0) do %>
              <div class="grid grid-cols-2">
                <p>Reconnection Fee</p>
                <p class="text-right"><%= Display.money(@latest_bill_calc.reconnection_amount) %></p>
              </div>
            <% end %>
            <%= if Decimal.gt?(@latest_bill_calc.surcharge, 0) do %>
              <div class="grid grid-cols-2">
                <p>Late Fee</p>
                <p class="text-right"><%= Display.money(@latest_bill_calc.surcharge) %></p>
              </div>
            <% end %>
            <div class="grid grid-cols-2 font-bold uppercase border-t-2 border-black">
              <p>Current Total</p>
              <p class="text-right bill-highlight"><%= Display.money(@latest_bill_calc.total) %></p>
            </div>
            <%= if Enum.count(@previous_bills) > 0 do %>
              <p class="text-center font-bold uppercase bill-highlight">Previous Unpaid Bills</p>
              <%= for bill <- @previous_bills do %>
                <div class="grid grid-cols-2">
                  <p><%= Display.display_period bill.billing_period %></p>
                  <p class="text-right"><%= Display.money(Bills.calculate_bill!(bill).total)  %></p>
                </div>
              <% end %>
            <% end %>
            <div class="grid grid-cols-2 font-bold uppercase border-t-2 border-black">
              <p>Total Unpaid</p>
              <p class="text-right bill-highlight"><%= Display.money(@total)  %></p>
            </div>
          </div>
        </div>
        <div class="death-aid-section">
          <p>Mutual Death Aid</p>
          <%= for recipient <- @death_aid_recipients do %>
            <p class="bill-highlight"><%= recipient %></p>
          <% end %>
        </div>
        <p>
          (Kindly disregard the previouse bills if payment has been made.)
        </p>
      </div>
    """
  end
end
