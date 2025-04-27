defmodule GuimbalWaterworks.Repo.Migrations.AlterBillReconnection do
  use Ecto.Migration

  def up do
    alter table(:bills) do
      add :reconnection_fee, :decimal, precision: 10, scale: 2, default: 0
    end

    flush()

    execute(set_reconnection_fee_amount())

    alter table(:bills) do
      remove :reconnection_fee?
    end
  end

  def down do
    alter table(:bills) do
      add :reconnection_fee?, :boolean, default: false
    end

    flush()

    execute(set_reconnection_fee_boolean())

    alter table(:bills) do
      remove :reconnection_fee
    end
  end

  def set_reconnection_fee_amount() do
    """
      UPDATE bills b
      SET reconnection_fee = r.reconnection_fee
      FROM billing_periods bp
      LEFT JOIN rates AS r ON bp.rate_id = r.id
      WHERE bp.id = b.billing_period_id
      AND b."reconnection_fee?";
    """
  end

  def set_reconnection_fee_boolean() do
    """
      UPDATE bills b
      SET "reconnection_fee?" = true
      WHERE b.reconnection_fee > 0;
    """
  end
end
