defmodule GuimbalWaterworks.Requests do
  alias GuimbalWaterworks.Requests.Resolvers.RequestResolver, as: RR

  defdelegate request_password_changeset(request, attrs), to: RR
end
