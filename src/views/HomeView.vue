<template>
  <timer
      ref="timer"
      :end-date="date"
  />
</template>

<script>
  import Timer from "@/components/Timer";

  export default {
    name: 'Home',

    components: {
      Timer,
    },

    data() {
      return {
        timerKey: 0,
        date: new Date('December 17, 2022 03:24:07')
      }
    },

    mounted() {
      setTimeout(() => {
        this.$refs.timer.destroy()
        this.date = new Date('December 15, 2022 03:24:40')
      },5000)
    }
  }
</script>
