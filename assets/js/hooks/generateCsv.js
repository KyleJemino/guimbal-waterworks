import { mkConfig, generateCsv, download } from "export-to-csv"

export default {
  mounted() {
    this.handleEvent("generate", ({ data }) => {
      today = new Date()

      const csvConfig = mkConfig({ 
        useKeysAsHeaders: true,
        filename: `payments_${today.toISOString()}`
      })

      const csv = generateCsv(csvConfig)(data)

      download(csvConfig)(csv)
    })
  }
}
