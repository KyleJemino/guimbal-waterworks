export default {
  mounted() {
    this.handleEvent("generate", (payload) => {
      console.log('generating csv...')
      console.log(payload)
    })
  }
}
