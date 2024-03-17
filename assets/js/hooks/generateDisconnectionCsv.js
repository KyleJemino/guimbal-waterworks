import { mkConfig, generateCsv, download } from "export-to-csv"

export default {
  mounted() {
    this.handleEvent("generate-disconnection", ({ msg }) => {
      today = new Date()

      const csvConfig = mkConfig({ 
        filename: `payments_${today.toISOString()}`,
        columnHeaders: [
          'member'
        ]
      })

      const csv = generateCsv(csvConfig)(data)

      download(csvConfig)(csv)
      window.alert(msg)
    })
  }
}
