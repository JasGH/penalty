<template>
  <div v-if="isEnded">
    Ended.
  </div>

  <div v-else>
    <div>Days: {{ days }}</div>
    <div>Hours: {{ hours }}</div>
    <div>Minutes: {{ minutes }}</div>
    <div>Seconds: {{ seconds }}</div>
  </div>
</template>

<script>
export default {
  name: 'Timer',
  props: {
    endDate: {
      type: Date // Date.parse(this.endDate)
    }
  },

  data () {
    return {
      days: null,
      hours: null,
      minutes: null,
      seconds: null,
      isEnded: null
    }
  },

  watch: {
    endDate: {
      handler: function(newValue) {
        this.destroy()
        this.setUpTimer()
        console.log('newVal', newValue)
      },
      deep: true
    }
  },

  methods: {
    updateRemaining (distance) {
      this.days = Math.floor(distance / (1000 * 60 * 60 * 24))
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000)
    },

    tick () {
      const currentTime = new Date()
      const distance = Math.max(this.endDate - currentTime, 0)
      this.updateRemaining(distance)

      if (distance === 0) {
        clearInterval(this.timer)
        this.isEnded = true
      }
    },

    setUpTimer() {
      this.tick()
      this.timer = setInterval(this.tick.bind(this), 1000)
    },

    destroy () {
      clearInterval(this.timer)
    },

    refreshTimer() {}
  },

  mounted () {
    this.setUpTimer()
  },




}
</script>
