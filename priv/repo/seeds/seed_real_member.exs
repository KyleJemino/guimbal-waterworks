alias Ecto.Multi
alias GuimbalWaterworks.Repo
alias GuimbalWaterworks.Helpers
alias GuimbalWaterworks.Members.Member

sheet_path = Path.join(:code.priv_dir(:guimbal_waterworks), "/static/gww-member-sheet.xlsx")

[ _title_row, _header_row | member_params_list ] =
  sheet_path
  |> Xlsxir.stream_list(0)
  |> Stream.map(
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
        unique_identifier: "#{unique_identifier}",
        street: street,
        type: 
          type
          |> String.downcase()
          |> String.to_atom()
          |> IO.inspect(),
        meter_no: meter_no,
        connected?: true,
        mda?: true,
        inserted_at: NaiveDateTime.local_now(),
        updated_at: NaiveDateTime.local_now()
      }
      _ -> nil
    end
  )
  |> Enum.to_list()

Multi.new()
|> Multi.insert_all(:members, Member, member_params_list)
|> Repo.transaction()
