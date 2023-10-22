defmodule GuimbalWaterworks.Requests do
  alias GuimbalWaterworks.Requests.Resolvers.RequestResolver, as: RR

  defdelegate password_request_changeset(request, attrs), to: RR
end
