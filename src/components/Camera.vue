<template>
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
          <div class="camera__navigation__current"
            :style="{
              left: `calc(${bgPosX}% - 80px)`
            }"
          ></div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgPosX: 50,
      zoomLvl: 1
    };
  },

  mounted() {
    const test = this.$refs.cameraImage;
    const imageW = test.clientWidth;
    let watchMove = false;
    let tmpX = 0;
    let tmpL = 0;
    let diff = 0;
    let diffL = 0;
    let currentGesture = "singleFinger";
    let pointerEvents = [];
    let fingers = [];

    const gesturesHandler = {
      singleFinger: {
        pointerdown: e => {
          watchMove = true;
          tmpX = e.clientX - diff;
        },
        pointerup: e => {
          watchMove = false;
        },
        pointermove: e => {
          if (!watchMove) return;
          diff = e.clientX - tmpX;
          this.bgPosX = 50 - diff / imageW * 100;
        }
      },
      pinch: {
        pointerdown: ([firstFinger, secondFinger]) => {
          const x1 = firstFinger.clientX;
          const y1 = firstFinger.clientY;
          const x2 = secondFinger.clientX;
          const y2 = secondFinger.clientY;
          tmpL = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) - diffL;
        },
        pointerup: e => {
          //console.log(e.pointerId, e.clientX)
        },
        pointermove: ([firstFinger, secondFinger]) => {
          const x1 = firstFinger.clientX;
          const y1 = firstFinger.clientY;
          const x2 = secondFinger.clientX;
          const y2 = secondFinger.clientY;

          const l = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
          diffL = l - tmpL;
          this.zoomLvl = Math.max(1, 1 + diffL / imageW * 3);
        }
      }
    };

    const findGesture = () => {
      if (pointerEvents.length === 2) {
        return "pinch";
      } else if (pointerEvents.length === 1) {
        return "singleFinger";
      }
    };

    test.addEventListener("touchmove", e => e.preventDefault());

    test.addEventListener("pointerdown", e => {
      test.setPointerCapture(e.pointerId);
      pointerEvents.push(e);
      currentGesture = findGesture();
      e.preventDefault();
      if (currentGesture === "singleFinger") {
        gesturesHandler["singleFinger"].pointerdown(e);
      } else if (currentGesture === "pinch") {
        const findedEvent = pointerEvents.find(
          i => i.pointerId === e.pointerId
        );
        const index = pointerEvents.indexOf(findedEvent);
        if (index !== -1) {
          pointerEvents[index] = e;
          if (pointerEvents.length === 2) {
            gesturesHandler["pinch"].pointerdown(pointerEvents);
          }
        }
      }
      return false;
    });

    test.addEventListener("pointerup", e => {
      test.releasePointerCapture(e.pointerId);

      pointerEvents = pointerEvents.filter(i => i.pointerId !== e.pointerId);
      if (currentGesture) {
        gesturesHandler[currentGesture].pointerup(e);
      }
    });

    test.addEventListener("pointermove", e => {
      e.preventDefault();
      if (currentGesture === "singleFinger") {
        gesturesHandler["singleFinger"].pointermove(e);
      } else if (currentGesture === "pinch") {
        const findedEvent = pointerEvents.find(
          i => i.pointerId === e.pointerId
        );
        const index = pointerEvents.indexOf(findedEvent);
        if (index !== -1) {
          pointerEvents[index] = e;
          if (pointerEvents.length === 2) {
            gesturesHandler["pinch"].pointermove(pointerEvents);
          }
        }
      }
    });
  }
};
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
    border-radius 8px
    overflow hidden

    &__current {
      position absolute
      border-radius 8px
      width 160px
      height 100%
      background rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
