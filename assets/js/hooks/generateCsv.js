import { mkConfig, generateCsv, download } from "export-to-csv"

export default {
  mounted() {
    this.handleEvent("generate", ({ data }) => {
      today = new Date()

      const csvConfig = mkConfig({ 
        filename: `payments_${today.toISOString()}`,
        columnHeaders: [
          'member',
          'address', 
          'or',
          'current',
          'overdue',
          'billing_periods',
          'surcharges',
          'death_aid',
          'franchise_tax',
          'membership_and_advance_fee',
          'reconnection_fee',
          'total',
          'total_paid',
          'paid_at',
          'cashier'
        ]
      })

      const csv = generateCsv(csvConfig)(data)

      download(csvConfig)(csv)
    })
  }
}
