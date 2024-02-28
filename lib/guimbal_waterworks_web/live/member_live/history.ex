defmodule GuimbalWaterworksWeb.MemberLive.History do
  use GuimbalWaterworksWeb, :live_view

  alias GuimbalWaterworks.Bills
  alias GuimbalWaterworks.Members

  @impl true
  def mount(
    %{
      "id" => member_id,
      "year" => year
    }, 
    _session, 
    socket
  ) do
    member = Members.get_member!(member_id)


    bills =
      Bills.list_bills(%{
        "member_id" => member_id, 
        "year" => year,
        "preload" => [:billing_period, :payment]
      })

    {:ok, 
      socket
      |> assign(:bills, bills)
      |> assign(:member, member)
    }
  end
end
