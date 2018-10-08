<template>
  <div>
  <div class="camera">
    <div
      ref="cameraImage"
      :style="{
        backgroundImage:`url(${require('@/assets/panorama.jpg')}`,
        backgroundPositionX: `${bgPosX}%`,
        transform: `scale(${zoomLvl})`,
      }"
      class="camera__image">
      <div class="camera__navigation">
        <div 
          :style="{
            left: `calc(${bgPosX}% - 80px)`
          }"
          class="camera__navigation__current"
        />
      </div>
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
    }
  },

  mounted() {
    const test = this.$refs.cameraImage
    const imageW = test.clientWidth
    let watchMove = false
    let tmpX = 0
    let tmpL = 0
    let diff = 0
    let diffL = 0
    let currentGesture = 'singleFinger'
    let pointerDownEvents = []
    let pointerMoveEvents = []
    let fingers = []
    console.log(test, imageW)

    const isRotate = () => {
      const dx1 = pointerMoveEvents[0].clientX - pointerDownEvents[0].clientX
      const dy1 = pointerMoveEvents[0].clientY - pointerDownEvents[0].clientY
      const dx2 = pointerMoveEvents[1].clientX - pointerDownEvents[1].clientX
      const dy2 = pointerMoveEvents[1].clientY - pointerDownEvents[1].clientY

      if (Math.abs(dx1) > Math.abs(dy1) && Math.abs(dx2) > Math.abs(dy2)) {
        if (dx1 >= 2.0 && dx2 <= -2.0) {
          return true
        } else if (dx1 <= -2.0 && dx2 >= 2.0) {
          return true
        }
      } else {
        if (dy1 >= 2.0 && dy2 <= -2.0) {
          return true
        } else if (dy1 <= -2.0 && dy2 >= 2.0) {
          return true
        }
      }
      return false
    }

    const gesturesHandler = {
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
          this.bgPosX = 50 - diff / imageW * 100
        }
      },
      pinch: {
        pointerdown: ([firstFinger, secondFinger]) => {
          const x1 = firstFinger.clientX
          const y1 = firstFinger.clientY
          const x2 = secondFinger.clientX
          const y2 = secondFinger.clientY
          tmpL = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) - diffL
        },
        pointerup: e => {
          //console.log(e.pointerId, e.clientX)
        },
        pointermove: ([firstFinger, secondFinger]) => {
          const x1 = firstFinger.clientX
          const y1 = firstFinger.clientY
          const x2 = secondFinger.clientX
          const y2 = secondFinger.clientY

          const l =
            Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) - diffL
          diffL = l - tmpL
          this.zoomLvl = Math.max(1, 1 + diffL / imageW * 3)
        }
      }
    }

    const findGesture = () => {
      if (pointerDownEvents.length === 2 && pointerMoveEvents.length === 2) {
        if (isRotate()) return 'rotate'
      }
    }

    // test.addEventListener('touchmove', e => e.preventDefault())
    test.addEventListener('touchmove', e => {
      e.preventDefault()
    })

    test.addEventListener('pointerdown', e => {
      // test.setPointerCapture(e.pointerId);
      pointerDownEvents.push(e)

      // if (currentGesture === "singleFinger") {
      //   gesturesHandler["singleFinger"].pointerdown(e);
      // } else if (currentGesture === "pinch") {
      //   const findedEvent = pointerEvents.find(
      //     i => i.pointerId === e.pointerId
      //   );
      //   const index = pointerEvents.indexOf(findedEvent);
      //   if (index !== -1) {
      //     pointerLastEvents.push(pointerEvents[index])
      //     pointerEvents[index] = e;
      //     if (pointerEvents.length === 2) {
      //       gesturesHandler["pinch"].pointerdown(pointerEvents);
      //     }
      //   }
      // }
      // return false;
    })

    test.addEventListener('pointerup', e => {
      // test.releasePointerCapture(e.pointerId);
      pointerDownEvents = pointerDownEvents.filter(
        i => i.pointerId !== e.pointerId
      )
      pointerMoveEvents = pointerMoveEvents.filter(
        i => i.pointerId !== e.pointerId
      )

      if (currentGesture) {
        gesturesHandler[currentGesture].pointerup(e)
      }
    })

    test.addEventListener('pointermove', e => {
      e.preventDefault()

      console.log(e)

      if (pointerDownEvents.length >= 2) {
        if (pointerDownEvents.find(i => i.pointerId === e.pointerId)) {
          const findedMove = pointerMoveEvents.find(
            i => i.pointerId === e.pointerId
          )
          if (!findedMove) {
            pointerMoveEvents.push(e)
          } else {
            pointerMoveEvents[pointerMoveEvents.indexOf(findedMove)] = e
          }
        }
        const gesture = findGesture()

        if (gesture === 'rotate') {
          const dx1 =
            pointerMoveEvents[0].clientX - pointerDownEvents[0].clientX
          const dy1 =
            pointerMoveEvents[0].clientY - pointerDownEvents[0].clientY
          const dx2 =
            pointerMoveEvents[1].clientX - pointerDownEvents[1].clientX
          const dy2 =
            pointerMoveEvents[1].clientY - pointerDownEvents[1].clientY

          const cX = (pointerMoveEvents[0].clientX - pointerDownEvents[1].clientX)/2
          const cY = (pointerMoveEvents[0].clientY - pointerDownEvents[1].clientY)/2       
        }
      }
    })
  }

}
</script>

<style lang="stylus" scoped>
.camera {
  width: 100%;
  height: 300px;
  overflow: hidden;

  &__image {
    position: relative;
    height: 100%;
    width: 100%;
  }

  &__navigation {
    position: absolute;
    left: 10%;
    bottom: 0;
    width: 80%;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    overflow: hidden;

    &__current {
      position: absolute;
      border-radius: 8px;
      width: 160px;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
