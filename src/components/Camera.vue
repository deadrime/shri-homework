<template>
  <div>
    <div class="camera">
      <div
        ref="cameraImage"
        :style="{
          backgroundImage:`url(${require('@/assets/panorama.jpg')}`,
          backgroundPositionX: `${bgPosX}%`,
          backgroundPositionY: `${bgPosY}%`,
          transform: `scale(${zoomLvl})`,
          filter: `brightness(${brightness}%)`,
        }"
        touch-action="none"
        class="camera__image"/>
      <div 
        ref="preview" 
        class="camera__navigation">
        <div 
          :style="{
            left: `calc(${bgPosX}%)`,
            width: `${previewW}px`,
            transform: `translateX(-${bgPosX}%)`,
          }"
          touch-action="none"
          class="camera__navigation__current"
        />
      </div>
    </div>
    <div class="info">
      <p>Уровень приблежения: {{ (zoomLvl*100).toFixed(1) }}%</p>
      <p>Уровень яркости: {{ brightness.toFixed(1) }}% </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      bgPosX: 50,
      bgPosY: 50,
      zoomLvlTmp: 0,
      zoomLvl: 1,
      brightness: 100,
      previewW: 0,
      info: {},
    }
  },
  mounted() {
    const camera = this.$refs.cameraImage as HTMLElement
    const preview = this.$refs.previe as HTMLElement
    const imageW = camera.clientWidth
    const imageH = camera.clientHeight
    this.previewW = (preview.clientWidth * imageW) / 2000
    let watchMove = false
    let tmpX = 0
    let tmpY = 0
    let tmpL = 0
    let diffX = 0
    let diffY = 0
    let currentGesture: string | null = null
    let pointerDownEvents: {[key: number]: PointerEvent} = {}
    let pointerMoveEvents: {[key: number]: PointerEvent} = {}
    let brightnessTmp = 100
    const rotateDetectLvl = 10

    const getMidpoint = (x1: number, x2 : number, y1 : number, y2: number): {x: number, y: number} => {
      return {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2
      }
    }

    const spaceBetween = (x1: number, x2 :number, y1: number, y2: number): number=> {
      return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    }

    // старый метод для определения rotate
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

    const gesturesHandler: any = {
      singleFinger: {
        pointerdown: (e: PointerEvent) => {
          if (Object.values(pointerDownEvents).length > 1) return
          watchMove = true
          tmpX = e.clientX - diffX
          tmpY = e.clientY - diffY
        },
        pointerup: (e: PointerEvent) => {
          if (Object.values(pointerDownEvents).length > 1) return
          watchMove = false
        },
        pointermove: (e: PointerEvent) => {
          if (
            Object.values(pointerDownEvents).length > 1 ||
            Object.values(pointerMoveEvents).length > 1
          )
            return
          if (!watchMove) return
          diffX = e.clientX - tmpX
          diffY = e.clientY - tmpY
          const positionX = 50 - (diffX / imageW) * 50
          const positionY = 50 - (diffY / imageH) * 50 * 2000 / 541
          this.bgPosX = Math.min(100, Math.max(0, positionX))
          this.bgPosY = Math.min(100, Math.max(0, positionY))
        }
      },
      pinch: {
        pointerdown: () => {
          this.zoomLvlTmp = this.zoomLvl
        },
        pointerup: () => {},
        pointermove: () => {
          const [move1, move2] = Object.values(pointerMoveEvents)
          const [down1, down2] = Object.values(pointerDownEvents)
    
          const l1 = spaceBetween(down1.clientX, down2.clientX, down1.clientY, down2.clientY)
          const l2 = spaceBetween(move1.clientX, move2.clientX, move1.clientY, move2.clientY)

          const delta = (l2 - l1) / 50
          const newZoom = delta + this.zoomLvlTmp
          
          this.zoomLvl = Math.min(5, Math.max(1, newZoom))

          const preview = this.$refs.preview as HTMLElement
          this.previewW = preview.clientWidth * imageW / 2000 / this.zoomLvl
        }
      },
      rotate: {
        pointerdown: () => {
          brightnessTmp = this.brightness
        },
        pointerup: () => {},
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
          const newBrightness = deltaAngle + brightnessTmp
          this.brightness = Math.min(300, Math.max(0, newBrightness))
        },
      }
    }

    const deleteEvent = ({pointerId}: any) => {
      if (!pointerId) return
      delete pointerDownEvents[pointerId]
      delete pointerMoveEvents[pointerId]
      camera.releasePointerCapture(pointerId)
      if (
        Object.keys(pointerMoveEvents).length === 0 &&
        Object.keys(pointerDownEvents).length === 0
      ) currentGesture = null
    }

    const findGesture = () => {
      const movedLength = Object.keys(pointerMoveEvents).length
      const dawnLength = Object.keys(pointerDownEvents).length
      if (movedLength === 2 && dawnLength === 2) { // если 2 пальца
        const [move1, move2] = Object.values(pointerMoveEvents)
        const [down1, down2] = Object.values(pointerDownEvents)

        const d1 = spaceBetween(move1.clientX, down1.clientX, move1.clientY, down1.clientY)
        const d2 = spaceBetween(move2.clientX, down2.clientX, move2.clientY, down2.clientY)

        if (d1 > 10 && d2 > 10) { // вектора длиной минимум 10 px
          const a = {
            x: down2.clientX - down1.clientX,
            y: down2.clientY - down1.clientY
          }
          const b = {
            x: move2.clientX - move1.clientX,
            y: move2.clientY - move1.clientY
          }
          const test = Math.abs(Math.abs(a.x/b.x) - Math.abs(a.y/b.y))
          // проверяем, насколько эти два вектора близки к тому, чтобы быть лежать на одной прямой
          currentGesture = test > 0.45 ? 'rotate' : 'pinch'
        }
      }
      return null
    }

    camera.addEventListener('touchmove', e => {
      e.preventDefault()
    })

    camera.addEventListener('pointerdown', e => {
      e.preventDefault()
      camera.setPointerCapture(e.pointerId)
      pointerDownEvents[e.pointerId] = e
      gesturesHandler['pinch'].pointerdown(e)
      gesturesHandler['rotate'].pointerdown(e)
      gesturesHandler['singleFinger'].pointerdown(e)
    })

    camera.addEventListener('pointerup', e => {
      deleteEvent(e)
      gesturesHandler['singleFinger'].pointerup(e)
    })

    camera.addEventListener('pointercancel', deleteEvent)
  
    camera.addEventListener('pointerleave ', deleteEvent)

    camera.addEventListener('pointermove', e => {
      pointerMoveEvents[e.pointerId] = e
      if (
        Object.keys(pointerDownEvents).length >= 2 &&
        Object.keys(pointerMoveEvents).length >= 2
      ) {
        if (!currentGesture) findGesture()
        else gesturesHandler[currentGesture].pointermove(e)
      } else {
        if (!currentGesture) gesturesHandler['singleFinger'].pointermove(e)
      }
    })
  }
})
</script>

<style lang="stylus" scoped>
.camera
  margin-top 1rem
  border-radius .5rem
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
