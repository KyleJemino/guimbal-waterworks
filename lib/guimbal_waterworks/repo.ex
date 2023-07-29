defmodule GuimbalWaterworks.Repo do
  use Ecto.Repo,
    otp_app: :guimbal_waterworks,
    adapter: Ecto.Adapters.Postgres
end
