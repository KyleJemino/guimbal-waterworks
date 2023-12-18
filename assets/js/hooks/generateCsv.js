import { mkConfig, generateCsv, download } from "export-to-csv"

export default {
  mounted() {
    this.handleEvent("generate", ({ data }) => {
      today = new Date()

      const csvConfig = mkConfig({ 
        useKeysAsHeaders: true,
        filename: `payments_${today.toISOString()}`
      })

      const formattedData = data.map((paymentData) => {
        const formattedBills = paymentData.bills.reduce(
          (formatted, bill) => `${formatted}\n${bill.name}:${bill.amount}`, ''
        )

        return {
          ...paymentData,
          bills: formattedBills
        }
      })

      const csv = generateCsv(csvConfig)(formattedData)

      download(csvConfig)(csv)
    })
  }
}
