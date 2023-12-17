defmodule GuimbalWaterworks.Requests do
  alias GuimbalWaterworks.Requests.Resolvers.RequestResolver, as: RR

  defdelegate password_request_changeset(request, attrs), to: RR
  defdelegate create_request(params), to: RR
  defdelegate list_requests(params \\ %{}), to: RR
  defdelegate get_request(params \\ %{}), to: RR
  defdelegate approve_request(request), to: RR
  defdelegate archive_request(request), to: RR
end
