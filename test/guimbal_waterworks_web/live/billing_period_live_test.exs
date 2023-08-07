defmodule GuimbalWaterworksWeb.BillingPeriodLiveTest do
  use GuimbalWaterworksWeb.ConnCase

  import Phoenix.LiveViewTest
  import GuimbalWaterworks.BillsFixtures

  @create_attrs %{due_date: %{day: 6, month: 8, year: 2023}, from: %{day: 6, month: 8, year: 2023}, month: "some month", to: %{day: 6, month: 8, year: 2023}, year: "some year"}
  @update_attrs %{due_date: %{day: 7, month: 8, year: 2023}, from: %{day: 7, month: 8, year: 2023}, month: "some updated month", to: %{day: 7, month: 8, year: 2023}, year: "some updated year"}
  @invalid_attrs %{due_date: %{day: 30, month: 2, year: 2023}, from: %{day: 30, month: 2, year: 2023}, month: nil, to: %{day: 30, month: 2, year: 2023}, year: nil}

  defp create_billing_period(_) do
    billing_period = billing_period_fixture()
    %{billing_period: billing_period}
  end

  describe "Index" do
    setup [:create_billing_period]

    test "lists all billing_periods", %{conn: conn, billing_period: billing_period} do
      {:ok, _index_live, html} = live(conn, Routes.billing_period_index_path(conn, :index))

      assert html =~ "Listing Billing periods"
      assert html =~ billing_period.month
    end

    test "saves new billing_period", %{conn: conn} do
      {:ok, index_live, _html} = live(conn, Routes.billing_period_index_path(conn, :index))

      assert index_live |> element("a", "New Billing period") |> render_click() =~
               "New Billing period"

      assert_patch(index_live, Routes.billing_period_index_path(conn, :new))

      assert index_live
             |> form("#billing_period-form", billing_period: @invalid_attrs)
             |> render_change() =~ "is invalid"

      {:ok, _, html} =
        index_live
        |> form("#billing_period-form", billing_period: @create_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.billing_period_index_path(conn, :index))

      assert html =~ "Billing period created successfully"
      assert html =~ "some month"
    end

    test "updates billing_period in listing", %{conn: conn, billing_period: billing_period} do
      {:ok, index_live, _html} = live(conn, Routes.billing_period_index_path(conn, :index))

      assert index_live |> element("#billing_period-#{billing_period.id} a", "Edit") |> render_click() =~
               "Edit Billing period"

      assert_patch(index_live, Routes.billing_period_index_path(conn, :edit, billing_period))

      assert index_live
             |> form("#billing_period-form", billing_period: @invalid_attrs)
             |> render_change() =~ "is invalid"

      {:ok, _, html} =
        index_live
        |> form("#billing_period-form", billing_period: @update_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.billing_period_index_path(conn, :index))

      assert html =~ "Billing period updated successfully"
      assert html =~ "some updated month"
    end

    test "deletes billing_period in listing", %{conn: conn, billing_period: billing_period} do
      {:ok, index_live, _html} = live(conn, Routes.billing_period_index_path(conn, :index))

      assert index_live |> element("#billing_period-#{billing_period.id} a", "Delete") |> render_click()
      refute has_element?(index_live, "#billing_period-#{billing_period.id}")
    end
  end

  describe "Show" do
    setup [:create_billing_period]

    test "displays billing_period", %{conn: conn, billing_period: billing_period} do
      {:ok, _show_live, html} = live(conn, Routes.billing_period_show_path(conn, :show, billing_period))

      assert html =~ "Show Billing period"
      assert html =~ billing_period.month
    end

    test "updates billing_period within modal", %{conn: conn, billing_period: billing_period} do
      {:ok, show_live, _html} = live(conn, Routes.billing_period_show_path(conn, :show, billing_period))

      assert show_live |> element("a", "Edit") |> render_click() =~
               "Edit Billing period"

      assert_patch(show_live, Routes.billing_period_show_path(conn, :edit, billing_period))

      assert show_live
             |> form("#billing_period-form", billing_period: @invalid_attrs)
             |> render_change() =~ "is invalid"

      {:ok, _, html} =
        show_live
        |> form("#billing_period-form", billing_period: @update_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.billing_period_show_path(conn, :show, billing_period))

      assert html =~ "Billing period updated successfully"
      assert html =~ "some updated month"
    end
  end
end
