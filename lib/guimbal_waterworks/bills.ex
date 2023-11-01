defmodule GuimbalWaterworks.Bills do
  @moduledoc """
  The Bills context.
  """

  import Ecto.Query, warn: false
  alias GuimbalWaterworks.Repo

  alias GuimbalWaterworks.Bills.BillingPeriod
  alias GuimbalWaterworks.Bills.Resolvers.BillingPeriodResolver, as: BPR
  alias GuimbalWaterworks.Bills.Resolvers.BillResolver, as: BR
  alias GuimbalWaterworks.Bills.Resolvers.PaymentResolver, as: PR
  alias GuimbalWaterworks.Bills.Resolvers.RateResolver, as: RR

  alias GuimbalWaterworks.Bills.Queries.BillQuery, as: BQ

  defdelegate list_billing_periods(params \\ %{}), to: BPR

  @doc """
  Gets a single billing_period.

  Raises `Ecto.NoResultsError` if the Billing period does not exist.

  ## Examples

      iex> get_billing_period!(123)
      %BillingPeriod{}

      iex> get_billing_period!(456)
      ** (Ecto.NoResultsError)

  """
  def get_billing_period!(id), do: Repo.get!(BillingPeriod, id)

  @doc """
  Creates a billing_period.

  ## Examples

      iex> create_billing_period(%{field: value})
      {:ok, %BillingPeriod{}}

      iex> create_billing_period(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_billing_period(attrs \\ %{}) do
    %BillingPeriod{}
    |> BillingPeriod.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a billing_period.

  ## Examples

      iex> update_billing_period(billing_period, %{field: new_value})
      {:ok, %BillingPeriod{}}

      iex> update_billing_period(billing_period, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_billing_period(%BillingPeriod{} = billing_period, attrs) do
    billing_period
    |> BillingPeriod.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a billing_period.

  ## Examples

      iex> delete_billing_period(billing_period)
      {:ok, %BillingPeriod{}}

      iex> delete_billing_period(billing_period)
      {:error, %Ecto.Changeset{}}

  """
  def delete_billing_period(%BillingPeriod{} = billing_period) do
    Repo.delete(billing_period)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking billing_period changes.

  ## Examples

      iex> change_billing_period(billing_period)
      %Ecto.Changeset{data: %BillingPeriod{}}

  """
  def change_billing_period(%BillingPeriod{} = billing_period, attrs \\ %{}) do
    BillingPeriod.changeset(billing_period, attrs)
  end

  defdelegate new_billing_period(), to: BPR

  defdelegate query_bill(params \\ %{}), to: BQ
  defdelegate list_bills(params \\ %{}), to: BR
  defdelegate get_bill_by_id(id), to: BR
  defdelegate create_bill(params \\ %{}), to: BR
  defdelegate change_bill(bill, params \\ %{}), to: BR
  defdelegate new_bill(params \\ %{}), to: BR
  defdelegate calculate_bill(bill, billing_period, member, payment), to: BR
  defdelegate calculate_bill!(bill), to: BR
  defdelegate get_bill_total(bill), to: BR
  defdelegate count_bills(params \\ %{}), to: BR

  defdelegate list_payments(params \\ %{}), to: PR
  defdelegate create_payment(params), to: PR
  defdelegate change_payment(payment, params \\ %{}), to: PR
  defdelegate count_payments(params \\ %{}), to: PR

  defdelegate create_rate(attrs \\ %{}), to: RR
  defdelegate rate_changeset(rate, attrs \\ %{}), to: RR
  defdelegate list_rates(params \\ %{}), to: RR
  defdelegate get_rate(params \\ %{}), to: RR
end
