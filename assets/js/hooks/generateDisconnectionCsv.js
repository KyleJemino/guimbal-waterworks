import { mkConfig, generateCsv, download } from "export-to-csv"

export default {
  mounted() {
    this.handleEvent("generate-disconnection", 
      ({ 
        rows,
        period_headers,
        street,
        total
      }) => {
        const latest_period = period_headers[period_headers.length - 1]
        const csvConfig = mkConfig({ 
          filename: `DISCONNECTION_LIST_${latest_period}_${street}`,
          columnHeaders: [
            'index',
            street,
            ...period_headers,
            'SC',
            'FT',
            'DA',
            'Others',
            'Total'
          ]
        })

        const csv = generateCsv(csvConfig)(rows)

        download(csvConfig)(csv)
      })
  }
}
