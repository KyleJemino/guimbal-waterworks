defmodule GuimbalWaterworks.Repo.Migrations.AlterRateReconnectionFeeField do
  use Ecto.Migration

  def up do
    alter table(:rates) do
      add :reconnection_fees, {:array, :decimal}, default: [], precision: 10, scale: 2
    end

    flush()

    execute(populate_reconnection_fees())

    alter table(:rates) do
      remove :reconnection_fee
    end
  end

  def down do
    alter table(:rates) do
      add :reconnection_fee, :decimal, precision: 10, scale: 2, default: 0
    end

    flush()

    execute(populate_reconnection_fee())

    alter table(:rates) do
      remove :reconnection_fees
    end
  end

  def populate_reconnection_fees() do
    """
    UPDATE rates r
    SET reconnection_fees = ARRAY[r.reconnection_fee]
    """
  end

  def populate_reconnection_fee() do
    """
    UPDATE rates r
    SET reconnection_fee = r.reconnection_fees[1]
    """
  end
end
