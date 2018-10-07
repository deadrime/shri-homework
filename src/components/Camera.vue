<template>
  <div class="camera">
    <div
      ref="cameraImage"
      :style="{
        backgroundImage:`url(${require('@/assets/panorama.jpg')}`,
        backgroundPositionX: `${bgPosX}%`,
      }"
      class="camera__image"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgPosX: 50
    }
  },

  mounted() {
    const test = this.$refs.cameraImage
    const imageW = test.clientWidth
    let watchMove = false
    let tmpX = 0
    let diff = 0
    let currentEvent = 'singleFinger'

    const eventsHandler = {
      singleFinger: {
        pointerdown: e => {
          watchMove = true
          tmpX = e.clientX - diff
        },
        pointerup: e => {
          watchMove = false
        },
        pointermove: e => {
          if (!watchMove) return
          diff = e.clientX - tmpX
          this.bgPosX = 50 - (diff / imageW) * 100
        }
      }
    }

    test.addEventListener('pointerdown', e => {
      if (currentEvent) {
        eventsHandler[currentEvent].pointerdown(e)
      }
    })

    test.addEventListener('pointerup', e => {
      if (currentEvent) {
        eventsHandler[currentEvent].pointerdown(e)
      }
    })

    test.addEventListener('pointermove', e => {
      if (currentEvent) {
        eventsHandler[currentEvent].pointerdown(e)
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
.camera
  width 800px
  height 300px
  overflow hidden

  &__image
    height 100%
    width 100%
</style>
