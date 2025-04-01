import Config

# Only in tests, remove the complexity from the password hashing algorithm
config :bcrypt_elixir, :log_rounds, 1

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :guimbal_waterworks, GuimbalWaterworks.Repo,
  url: System.get_env("DATABASE_URL", "postgres://postgres:postgres@db/gww_test"),
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :guimbal_waterworks, GuimbalWaterworksWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "OmwSB3CH6p+023tauAgLeH856Pqv+PxjhvWqk+50MxVcJhTFxB+a1nI2aLQx5Sf4",
  server: false

# In test we don't send emails.
config :guimbal_waterworks, GuimbalWaterworks.Mailer, adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
