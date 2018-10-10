<template>
  <div>
    <div class="camera">
      <div
        ref="cameraImage"
        :style="{
          backgroundImage:`url(${require('@/assets/panorama.jpg')}`,
          backgroundPositionX: `${bgPosX}%`,
          transform: `scale(${zoomLvl})`,
          filter: `brightness(${brightness}%)`,
        }"
        class="camera__image"/>
      <div 
        ref="preview" 
        class="camera__navigation">
        <div 
          :style="{
            left: `calc(${bgPosX}% - ${previewW/2}px)`,
            width: `${previewW}px`,
          }"
          class="camera__navigation__current"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      bgPosX: 50,
      zoomLvl: 1,
      brightness: 100,
      previewW: 0
    }
  },
  mounted() {
    const camera = this.$refs.cameraImage
    const imageW = test.clientWidth
    this.previewW = (this.$refs.preview.clientWidth * imageW) / 2000

    let watchMove = false
    let tmpX = 0
    let tmpL = 0
    let diff = 0
    let diffL = 0
    let currentGesture = null
    let pointerDownEvents = {}
    let pointerMoveEvents = {}
    let fingers = []
    let brightnessTmp = 100
    const rotateDetectLvl = 10

    const getMidpoint = (x0, x1, y0, y1) => {
      return {
        x: (x0 + x1) / 2,
        y: (y0 + y1) / 2
      }
    }

    const isRotate = () => {
      const [move1, move2] = Object.values(pointerMoveEvents)
      const [down1, down2] = Object.values(pointerDownEvents)

      const dx1 = move1.clientX - down1.clientX
      const dy1 = move1.clientY - down1.clientY
      const dx2 = move2.clientX - down2.clientX
      const dy2 = move2.clientY - down2.clientY

      if (Math.abs(dx1) > Math.abs(dy1) && Math.abs(dx2) > Math.abs(dy2)) {
        if (dx1 >= rotateDetectLvl && dx2 <= -rotateDetectLvl) {
          return true
        } else if (dx1 <= -rotateDetectLvl && dx2 >= rotateDetectLvl) {
          return true
        }
      } else {
        if (dy1 >= rotateDetectLvl && dy2 <= -rotateDetectLvl) {
          return true
        } else if (dy1 <= -rotateDetectLvl && dy2 >= rotateDetectLvl) {
          return true
        }
      }
      return false
    }

    const isPinch = () => {
      const [move1, move2] = Object.values(pointerMoveEvents)
      const [down1, down2] = Object.values(pointerDownEvents)
      const m = getMidpoint(down1.x, down1.x, down1.y, down2.y)
      const d1 = Math.sqrt(
        (move1.clientX - m.x) ** 2 + (move1.clientY - m.y) ** 2
      )
      const d2 = Math.sqrt(
        (move2.clientX - m.x) ** 2 + (move2.clientY - m.y) ** 2
      )
      const diff = Math.abs(d1 - d2)
      if (diff >= 20) {
        return true
      } else {
        return false
      }
    }

    const gesturesHandler = {
      singleFinger: {
        pointerdown: e => {
          if (Object.values(pointerDownEvents).length > 1) return
          watchMove = true
          tmpX = e.clientX - diff
        },
        pointerup: e => {
          if (Object.values(pointerDownEvents).length > 1) return
          watchMove = false
        },
        pointermove: e => {
          if (Object.values(pointerDownEvents).length > 1 || Object.values(pointerMoveEvents).length > 1) return
          if (!watchMove) return
          diff = e.clientX - tmpX
          let position = 50 - (diff / imageW) * 100

          position = position > 100 ? 100 : position
          position = position < 0 ? 0 : position
          this.bgPosX = position
        }
      },
      pinch: {
        pointerdown: () => {
          const [firstFinger, secondFinger] = Object.values(
            pointerDownEvents
          )
          if (!firstFinger || !secondFinger) return
          const x1 = firstFinger.clientX
          const y1 = firstFinger.clientY
          const x2 = secondFinger.clientX
          const y2 = secondFinger.clientY
          tmpL = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) - diffL
          tmpZoom = this.zoomLvl
        },
        pointerup: e => {
          return false
        },
        pointermove: () => {
          const [firstFinger, secondFinger] = Object.values(
            pointerMoveEvents
          )
          const x1 = firstFinger.clientX
          const y1 = firstFinger.clientY
          const x2 = secondFinger.clientX
          const y2 = secondFinger.clientY

          const l = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
          diffL = l - tmpL
          this.zoomLvl = Math.max(1, 1 + diffL / imageW)
          this.previewW =
            (this.$refs.preview.clientWidth * imageW) / 2000 / this.zoomLvl
        }
      },
      rotate: {
        pointermove: () => {
          const [move1, move2] = Object.values(pointerMoveEvents)
          const [down1, down2] = Object.values(pointerDownEvents)
          
          const a = {
            x: down2.clientX - down1.clientX,
            y: down2.clientY - down1.clientY
          }
          const b = {
            x: move2.clientX - move1.clientX,
            y: move2.clientY - move1.clientY
          }

          const startAngle = Math.atan2(a.y, a.x)
          const endAngle = Math.atan2(b.y, b.x)
          const deltaAngle = (endAngle - startAngle) * 57.2958

          this.brightness = deltaAngle + brightnessTmp
        }
      }
    }

    const findGesture = () => {
      const movedLength = Object.keys(pointerMoveEvents).length
      const dawnLength = Object.keys(pointerDownEvents).length
      if (movedLength === 2 && dawnLength === 2) {
        if (isPinch()) currentGesture = 'pinch'
        if (isRotate()) currentGesture = 'rotate'
      }
    }

    camera.addEventListener('touchmove', e => {
      e.preventDefault()
    })

    camera.addEventListener('pointerdown', e => {
      e.preventDefault()
      pointerDownEvents[e.pointerId] = e
      gesturesHandler['pinch'].pointerdown(e)
      if (!currentGesture) gesturesHandler['singleFinger'].pointerdown(e)
    })

    camera.addEventListener('pointerup', e => {
      brightnessTmp = this.brightness
      delete pointerDownEvents[e.pointerId]
      delete pointerMoveEvents[e.pointerId]

      if (
        Object.keys(pointerDownEvents).length >= 2 &&
        Object.keys(pointerMoveEvents).length >= 2
      ) {
        gesturesHandler[currentGesture].pointerup(e)
      } else if (!currentGesture) {
        gesturesHandler['singleFinger'].pointerup(e)
      }
      if (Object.keys(pointerMoveEvents).length === 0 && Object.keys(pointerDownEvents).length === 0) currentGesture = null
    })

    camera.addEventListener('pointercancel', e => {
      delete pointerDownEvents[e.pointerId]
      delete pointerMoveEvents[e.pointerId]
      if (Object.keys(pointerMoveEvents).length === 0 && Object.keys(pointerDownEvents).length === 0) currentGesture = null
    })

    camera.addEventListener('pointerleave ', e => {
      delete pointerDownEvents[e.pointerId]
      delete pointerMoveEvents[e.pointerId]
      if (Object.keys(pointerMoveEvents).length === 0 && Object.keys(pointerDownEvents).length === 0) currentGesture = null
    })

    camera.addEventListener('pointermove', e => {
      pointerMoveEvents[e.pointerId] = e
      if (
        Object.keys(pointerDownEvents).length >= 2 &&
        Object.keys(pointerMoveEvents).length >= 2
      ) {
        // return gesturesHandler["pinch"].pointermove(e);
        if (!currentGesture) findGesture()
        else gesturesHandler[currentGesture].pointermove(e)
      } else {
        if (!currentGesture) gesturesHandler['singleFinger'].pointermove(e)
      }
    })
  }
}
</script>

<style lang="stylus" scoped>
.camera
  width 100%
  height 300px
  overflow hidden
  position relative

  &__image
    position relative
    height 100%
    width 100%

  &__navigation
    position absolute
    left 2%
    bottom 0
    width 96%
    height 60px
    background rgba(255, 255, 255, 0.2)
    border-radius 8px
    overflow hidden

    &__current
      position absolute
      border-radius 8px
      width 160px
      height 100%
      background rgba(0, 0, 0, 0.5)
</style>
