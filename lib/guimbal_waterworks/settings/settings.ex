defmodule GuimbalWaterworks.Settings do
  alias GuimbalWaterworks.Repo
  alias GuimbalWaterworks.Settings.Setting

  def create_or_update_setting(attrs) do
    case Repo.one(Setting) do
      %Setting{} = setting ->
        setting
        |> Setting.changeset(attrs)
        |> Repo.update()
      _ ->
        %Setting{}
        |> Setting.changeset(attrs)
        |> Repo.insert()
    end
  end

  def get_setting(), do: Repo.one(Setting)
end
