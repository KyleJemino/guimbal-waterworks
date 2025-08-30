import Ecto.Query
alias GuimbalWaterworks.Repo
alias GuimbalWaterworks.Members.Member

enye_update_query =
  from(
    m in Member,
    where: ilike(m.last_name, "%Ñ%"),
    update: [
      set: [
        last_name: fragment("replace(?, 'Ñ', 'N')", m.last_name)
      ]
    ]
  )

Repo.update_all(enye_update_query, [])
