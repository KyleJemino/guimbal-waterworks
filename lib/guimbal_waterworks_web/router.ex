defmodule GuimbalWaterworksWeb.Router do
  use GuimbalWaterworksWeb, :router

  import GuimbalWaterworksWeb.UsersAuth
  import GuimbalWaterworksWeb.Plugs.Settings
  alias GuimbalWaterworksWeb.Plugs.AuthorizeUser

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {GuimbalWaterworksWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_users
    plug :fetch_settings
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :require_manager do
    plug AuthorizeUser, [:manager]
  end

  pipeline :require_admin do
    plug AuthorizeUser, [:admin]
  end

  pipeline :require_cashier do
    plug AuthorizeUser, [:cashier]
  end

  scope "/", GuimbalWaterworksWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/forgot_password", RequestController, :forgot_password
    post "/forgot_password", RequestController, :forgot_password_token
  end

  # Other scopes may use custom stacks.
  # scope "/api", GuimbalWaterworksWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: GuimbalWaterworksWeb.Telemetry
    end
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  ## Authentication routes

  scope "/", GuimbalWaterworksWeb do
    pipe_through [:browser, :redirect_if_users_is_authenticated]

    get "/users/register", UsersRegistrationController, :new
    post "/users/register", UsersRegistrationController, :create
    get "/users/log_in", UsersSessionController, :new
    post "/users/log_in", UsersSessionController, :create
  end

  scope "/", GuimbalWaterworksWeb do
    pipe_through [:browser, :require_authenticated_users]

    delete "/users/log_out", UsersSessionController, :delete
  end

  live_session :printing,
    on_mount: [
      GuimbalWaterworksWeb.AssignUsers,
      GuimbalWaterworksWeb.OnMounts.AssignSettings
    ],
    root_layout: {GuimbalWaterworksWeb.LayoutView, "print_root.html"} do
    scope "/", GuimbalWaterworksWeb do
      pipe_through [:browser, :require_authenticated_users, :require_admin]
      live "/members/print", MemberLive.Print, :print
    end

    scope "/", GuimbalWaterworksWeb do
      pipe_through [:browser, :require_authenticated_users, :require_cashier]
      live "/members/:id/history/print", MemberLive.History, :print
    end
  end

  live_session :authenticated, on_mount: GuimbalWaterworksWeb.AssignUsers do
    scope "/", GuimbalWaterworksWeb do
      pipe_through [:browser, :require_authenticated_users, :require_manager]
      live "/settings", SettingsLive.IndexLive, :index
      live "/employees", EmployeeLive.Index, :index
      live "/employees/:employee_id/change-role", EmployeeLive.Index, :role_change

      live "/billing_periods/new", BillingPeriodLive.Index, :new
      live "/billing_periods/:id/edit", BillingPeriodLive.Index, :edit
      live "/billing_periods/:id/show/edit", BillingPeriodLive.Show, :edit

      live "/requests", RequestLive.Index, :index

      live "/rates", RateLive.Index, :index
      live "/rates/new", RateLive.Upload, :new
      live "/rates/:id", RateLive.Show, :show
    end

    scope "/", GuimbalWaterworksWeb do
      pipe_through [:browser, :require_authenticated_users, :require_admin]
      live "/members/new", MemberLive.Index, :new
      live "/members/:id/edit", MemberLive.Index, :edit
      live "/members/:id/new-bill", MemberLive.Index, :new_bill

      live "/members/:id/show/edit", MemberLive.Show, :edit
      live "/members/:id/show/new-bill", MemberLive.Show, :new_bill
      live "/members/:id/show/edit-bill/:bill_id", MemberLive.Show, :edit_bill
      live "/members/:id/show/history-form", MemberLive.Show, :history_form
      live "/billing_periods/:id/new-bill", BillingPeriodLive.Show, :new_bill
      live "/billing_periods/:id/new-bill/:member_id", BillingPeriodLive.Show, :new_bill
      live "/billing_periods/:id/edit-bill/:bill_id", BillingPeriodLive.Show, :edit_bill
    end

    scope "/", GuimbalWaterworksWeb do
      pipe_through [:browser, :require_authenticated_users, :require_cashier]

      live "/members/:id/pay_bills", MemberLive.Index, :payment
      live "/payments", PaymentLive.Index, :index
    end

    scope "/", GuimbalWaterworksWeb do
      pipe_through [:browser, :require_authenticated_users]

      live "/members", MemberLive.Index, :index
      live "/members/disconnection-form", MemberLive.Index, :disconnection_form

      live "/members/:id", MemberLive.Show, :show
      live "/members/:id/payments", MemberLive.Show, :payments

      live "/billing_periods", BillingPeriodLive.Index, :index
      live "/billing_periods/:id", BillingPeriodLive.Show, :show
      live "/billing_periods/:id/payments", BillingPeriodLive.Show, :payments
    end
  end
end
