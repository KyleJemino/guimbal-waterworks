alias Ecto.Multi
alias GuimbalWaterworks.Repo
alias GuimbalWaterworks.Members.Member

sheet_path = Path.join(:code.priv_dir(:guimbal_waterworks), "/static/gww-member-sheet.xlsx")

sheet_path
|> Xlsxir.peek(0, 5)
|> then(fn {:ok, tid} ->
  Xlsxir.get_list(tid)
end)

[ _title_row, _header_row | member_params_list ] =
  sheet_path
  |> Xlsxir.extract(0)
  |> then(&(elem(&1, 1)))
  |> Xlsxir.get_list()
  |> Enum.map(
    fn [
      _,
      first_name,
      middle_name,
      last_name,
      unique_identifier,
      street,
      type,
      meter_no
    ] when not is_nil(last_name) ->
      %{
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        unique_identifier: if not is_nil(unique_identifier) do
          "#{unique_identifier}"
        else
          nil
        end,
        street: street,
        type:
          type
          |> String.downcase()
          |> String.to_atom(),
        meter_no: meter_no,
        connected?: true,
        mda?: true,
        inserted_at: NaiveDateTime.local_now(),
        updated_at: NaiveDateTime.local_now()
      }
      _ -> nil
    end
  )

Multi.new()
|> Multi.insert_all(:members, Member, member_params_list)
|> Repo.transaction()
