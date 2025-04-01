defmodule GuimbalWaterworks.SettingsTest do
  use GuimbalWaterworks.DataCase

  alias GuimbalWaterworks.Repo
  alias GuimbalWaterworks.Settings
  alias GuimbalWaterworks.Settings.Setting

  describe "settings" do
    @invalid_attrs %{
      "contact_number" => nil,
      "address" => nil
    }

    @valid_attrs %{
      "contact_number" => "555-5555",
      "address" => "Poblacion, Guimbal"
    }

    test "create_or_update_setting/1 creates setting with valid value if no setting exists" do
      {:ok, %Setting{} = setting} = Settings.create_or_update_setting(@valid_attrs)

      assert setting.contact_number == @valid_attrs["contact_number"]
      assert setting.address == @valid_attrs["address"]
    end

    test "create_or_update_setting/1 returns error tuple with invalid data" do
      assert {:error, %Ecto.Changeset{}} = Settings.create_or_update_setting(@invalid_attrs)
    end

    test "create_or_udpate_setting/1 updates current setting with valid attributes" do
      {:ok, %Setting{contact_number: "555-5555"} = setting} =
        Settings.create_or_update_setting(@valid_attrs)

      {:ok, %Setting{} = updated_setting} =
        Settings.create_or_update_setting(%{"contact_number" => "666-6666"})

      assert updated_setting.id == setting.id
      assert updated_setting.contact_number == "666-6666"

      all_settings = Repo.all(Setting)
      assert Enum.count(all_settings) == 1
    end
  end
end
