defmodule GuimbalWaterworks.MembersTest do
  use GuimbalWaterworks.DataCase

  alias GuimbalWaterworks.Members

  describe "members" do
    alias GuimbalWaterworks.Members.Member

    import GuimbalWaterworks.MembersFixtures

    @invalid_attrs %{first_name: nil, last_name: nil, meter_no: nil, middle_name: nil, street: nil, type: nil, unique_identifier: nil}

    test "list_members/0 returns all members" do
      member = member_fixture()
      assert Members.list_members() == [member]
    end

    test "get_member!/1 returns the member with given id" do
      member = member_fixture()
      assert Members.get_member!(member.id) == member
    end

    test "create_member/1 with valid data creates a member" do
      valid_attrs = %{first_name: "some first_name", last_name: "some last_name", meter_no: 42, middle_name: "some middle_name", street: "some street", type: "some type", unique_identifier: "some unique_identifier"}

      assert {:ok, %Member{} = member} = Members.create_member(valid_attrs)
      assert member.first_name == "some first_name"
      assert member.last_name == "some last_name"
      assert member.meter_no == 42
      assert member.middle_name == "some middle_name"
      assert member.street == "some street"
      assert member.type == "some type"
      assert member.unique_identifier == "some unique_identifier"
    end

    test "create_member/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Members.create_member(@invalid_attrs)
    end

    test "update_member/2 with valid data updates the member" do
      member = member_fixture()
      update_attrs = %{first_name: "some updated first_name", last_name: "some updated last_name", meter_no: 43, middle_name: "some updated middle_name", street: "some updated street", type: "some updated type", unique_identifier: "some updated unique_identifier"}

      assert {:ok, %Member{} = member} = Members.update_member(member, update_attrs)
      assert member.first_name == "some updated first_name"
      assert member.last_name == "some updated last_name"
      assert member.meter_no == 43
      assert member.middle_name == "some updated middle_name"
      assert member.street == "some updated street"
      assert member.type == "some updated type"
      assert member.unique_identifier == "some updated unique_identifier"
    end

    test "update_member/2 with invalid data returns error changeset" do
      member = member_fixture()
      assert {:error, %Ecto.Changeset{}} = Members.update_member(member, @invalid_attrs)
      assert member == Members.get_member!(member.id)
    end

    test "delete_member/1 deletes the member" do
      member = member_fixture()
      assert {:ok, %Member{}} = Members.delete_member(member)
      assert_raise Ecto.NoResultsError, fn -> Members.get_member!(member.id) end
    end

    test "change_member/1 returns a member changeset" do
      member = member_fixture()
      assert %Ecto.Changeset{} = Members.change_member(member)
    end
  end
end
