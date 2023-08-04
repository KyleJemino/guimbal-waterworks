defmodule GuimbalWaterworksWeb.MemberLiveTest do
  use GuimbalWaterworksWeb.ConnCase

  import Phoenix.LiveViewTest
  import GuimbalWaterworks.MembersFixtures

  @create_attrs %{
    first_name: "some first_name",
    last_name: "some last_name",
    meter_no: 42,
    middle_name: "some middle_name",
    street: "some street",
    type: "some type",
    unique_identifier: "some unique_identifier"
  }
  @update_attrs %{
    first_name: "some updated first_name",
    last_name: "some updated last_name",
    meter_no: 43,
    middle_name: "some updated middle_name",
    street: "some updated street",
    type: "some updated type",
    unique_identifier: "some updated unique_identifier"
  }
  @invalid_attrs %{
    first_name: nil,
    last_name: nil,
    meter_no: nil,
    middle_name: nil,
    street: nil,
    type: nil,
    unique_identifier: nil
  }

  defp create_member(_) do
    member = member_fixture()
    %{member: member}
  end

  describe "Index" do
    setup [:create_member]

    test "lists all members", %{conn: conn, member: member} do
      {:ok, _index_live, html} = live(conn, Routes.member_index_path(conn, :index))

      assert html =~ "Listing Members"
      assert html =~ member.first_name
    end

    test "saves new member", %{conn: conn} do
      {:ok, index_live, _html} = live(conn, Routes.member_index_path(conn, :index))

      assert index_live |> element("a", "New Member") |> render_click() =~
               "New Member"

      assert_patch(index_live, Routes.member_index_path(conn, :new))

      assert index_live
             |> form("#member-form", member: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      {:ok, _, html} =
        index_live
        |> form("#member-form", member: @create_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.member_index_path(conn, :index))

      assert html =~ "Member created successfully"
      assert html =~ "some first_name"
    end

    test "updates member in listing", %{conn: conn, member: member} do
      {:ok, index_live, _html} = live(conn, Routes.member_index_path(conn, :index))

      assert index_live |> element("#member-#{member.id} a", "Edit") |> render_click() =~
               "Edit Member"

      assert_patch(index_live, Routes.member_index_path(conn, :edit, member))

      assert index_live
             |> form("#member-form", member: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      {:ok, _, html} =
        index_live
        |> form("#member-form", member: @update_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.member_index_path(conn, :index))

      assert html =~ "Member updated successfully"
      assert html =~ "some updated first_name"
    end

    test "deletes member in listing", %{conn: conn, member: member} do
      {:ok, index_live, _html} = live(conn, Routes.member_index_path(conn, :index))

      assert index_live |> element("#member-#{member.id} a", "Delete") |> render_click()
      refute has_element?(index_live, "#member-#{member.id}")
    end
  end

  describe "Show" do
    setup [:create_member]

    test "displays member", %{conn: conn, member: member} do
      {:ok, _show_live, html} = live(conn, Routes.member_show_path(conn, :show, member))

      assert html =~ "Show Member"
      assert html =~ member.first_name
    end

    test "updates member within modal", %{conn: conn, member: member} do
      {:ok, show_live, _html} = live(conn, Routes.member_show_path(conn, :show, member))

      assert show_live |> element("a", "Edit") |> render_click() =~
               "Edit Member"

      assert_patch(show_live, Routes.member_show_path(conn, :edit, member))

      assert show_live
             |> form("#member-form", member: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      {:ok, _, html} =
        show_live
        |> form("#member-form", member: @update_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.member_show_path(conn, :show, member))

      assert html =~ "Member updated successfully"
      assert html =~ "some updated first_name"
    end
  end
end
