<template>
  <div class="cameras">
    <div 
      v-for="video in videos" 
      :key="video.id"
      :class="currentVideo === video.id ? 'camera camera--active' : 'camera'"
      :style="{
        zIndex: video.id === previousVideo ? '2' : null,
    }">
      <img 
        :src="require('@/assets/oval.svg')" 
        class="camera__loader" 
        width="60px" 
        alt="">
      <div 
        :style="{
          transform: `translateY(calc(100% - ${volume}%))`
        }"
        class="camera__volume"/>
      <div class="camera__controls">
        <button 
          class="camera__back"
          @click="handleClose(video.id)">Назад</button>
        <div class="camera__filters">
          <div class="camera__filters__item">
            <span class="icon icon-brightness"/>
            <input 
              v-model="video.brightness" 
              type="range" 
              name="brightness" 
              min="0" 
              max="300">
          </div>
          <div class="camera__filters__item">
            <span class="icon icon-contrast"/>
            <input 
              v-model="video.contrast" 
              type="range" 
              name="contrast" 
              min="0" 
              max="300" 
              step="2">
          </div>
          
        </div>
        <span :class="motionDetected ? 'camera__motion camera__motion--detected': 'camera__motion'">
          Датчик движения
        </span>
      </div>
      <video
        :style="{
          filter: `brightness(${video.brightness/100}) contrast(${video.contrast/100})`
        }"
        :ref="video.id"
        :muted="currentVideo !== video.id"
        class="camera__video"
        autoplay
        @click="handleClick(video.id)"
      />
    </div>
    <canvas 
      ref="motionDetectCanvas" 
      class="motion-detector"/>
  </div>
</template>
<script>
// import max from 'lodash/max'
import Loader from '@/assets/oval.svg?inline'
export default {
  components: {
    Loader,
  },
  data() {
    return {
      audioCtx: null,
      audioSource: null,
      audioAnalyser: null,
      volume: 0,
      motionLvl: 0,
      motionDetected: false,
      motionIntervalId: 0,
      currentVideo: null,
      previousVideo: null,
      videos: [
        {
          id: 'video1',
          url:
            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8',
          brightness: 100,
          contrast: 100,
        },
        {
          id: 'video2',
          url:
            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
          brightness: 100,
          contrast: 100,
        },
        {
          id: 'video3',
          url:
            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
          brightness: 100,
          contrast: 100,
        },
        {
          id: 'video4',
          url:
            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8',
          brightness: 100,
          contrast: 100,
        }
      ],
      loaded: {}
    }
  },
  mounted() {
    this.videos.forEach(({ id, url }) => {
      const el = this.$refs[id][0]
      this.initVideo(el, url)
        .then(hsl => {
          this.loaded[id] = hsl
        })
        .catch(err => {
          console.log(err)
        })
    })
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    this.audioAnalyser = this.audioCtx.createScriptProcessor(1024, 1, 1)
    this.audioAnalyser.connect(this.audioCtx.destination)
    this.audioAnalyser.addEventListener('audioprocess', this.handleVolume)

  },
  methods: {
    detectMotion(id) {
      const width = 640
      const height = 480
      const canvas = this.$refs.motionDetectCanvas
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      const watch = this.$refs[id][0]
      let imageData, frameDiff, diff
      let motionDetectedDelay = false

      let prevImageData = context.getImageData(0, 0, width, height).data

      const animate = () => {
        context.drawImage(watch, 0, 0, width, height)
        imageData = context.getImageData(0, 0, width, height).data

        frameDiff = 0
        for (let i = 0; i < imageData.length; i += 4) {
          diff = 0
          for (let j = 0; j < 3; j++) {
            diff += ((imageData[i + j] - prevImageData[i + j]) / 255) ** 2
          }
          frameDiff += diff ** 1 / 2
        }
        frameDiff /= imageData.length / 4
        prevImageData = imageData

        if (!motionDetectedDelay) {
          this.motionDetected = frameDiff > 0.00008 ? 1 : 0
          if (this.motionDetected) {
            motionDetectedDelay = true
            setInterval(() => {
              motionDetectedDelay = false
            }, 500)
          }
        }
      }
      this.motionIntervalId = setInterval(animate, 100)
      animate()
    },
    stopWatching() {
      clearInterval(this.motionIntervalId)
    },
    handleClick(id) {
      if (this.currentVideo === id) return
      this.$refs[id][0].volume = 1
      this.currentVideo = id
      this.detectMotion(id)

      if(this.previousVideo !== id) {
        const audioSource = this.audioCtx.createMediaElementSource(this.$refs[id][0])
        audioSource.connect(this.audioAnalyser)
      }
    },
    handleClose(id) {
      this.previousVideo = id
      this.currentVideo = null
      this.stopWatching(id)
    },
    changeQuality(id) {
      const hls = this.loaded[id]
      hls.loadLevel = 2
      hls.startLoad()
    },
    handleVolume(e) {
      const out = e.outputBuffer.getChannelData(0)
      const int = e.inputBuffer.getChannelData(0)
      let maxVolume = 0
      for (let i = 0; i < int.length; i++) {
        out[i] = int[i]
        maxVolume = Math.max(int[i], maxVolume)
      }
      this.volume = Math.min(100, Math.max(0, maxVolume*100*2))
    },
    initVideo(video, url, autoQuality = false) {
      return new Promise((resolve, reject) => {
        const hls = new window.Hls({ autoStartLoad: false })
        hls.loadSource(url)
        hls.attachMedia(video)
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          hls.loadLevel = autoQuality ? -1 : 0
          hls.startLoad()
          resolve(hls)
        })
        hls.on(window.Hls.Events.ERROR, err => {
          reject(new Error(err))
        })
      })
    },
  }
}
</script>

<style lang="stylus" scoped>

.icon
  display block
  width 25px
  height 24px
  margin-right .5rem
  background-position: center;
  background-size: cover;

.icon-brightness
  background-image url('../assets/icons/brightness.svg')

.icon-contrast
  background-image url('../assets/icons/contrast.svg')

.cameras
  display flex
  margin 1rem auto
  flex-wrap wrap
  width 960px
  height 720px
  border-radius 0.5rem
  position relative
  overflow hidden

.camera
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  overflow hidden
  background #000
  transition transform 0.3s

  &:nth-child(1)
    transform scale(0.5) translateX(-50%) translateY(-50%)

  &:nth-child(2)
    transform scale(0.5) translateX(50%) translateY(-50%)

  &:nth-child(3)
    transform scale(0.5) translateX(-50%) translateY(50%)

  &:nth-child(4)
    transform scale(0.5) translateX(50%) translateY(50%)

  &--active
    z-index 999
    transform scale(1) translateX(0%) translateY(0%) !important

    .camera__controls
      opacity 1
      transition 0.4s opacity 0.2s

    .camera__volume
      opacity 1

  &__video
    width 100%
    height 100%

  &__loader
    position absolute
    left 50%
    top 50%
    transform translateX(-50%) translateY(-50%)

  &__controls
    display flex
    align-items center
    opacity 0
    transition opacity 0.2s
    padding 1rem
    box-sizing border-box
    width 100%
    position absolute
    left 0
    top 0
    z-index 3
    background rgba(0, 0, 0, 0.3)

  &__volume
    opacity 0
    position absolute
    top 0
    right 0
    width 50px
    height 100%
    transition transform 0.02s
    background rgba(76, 175, 80, 0.7)
    border-top-left-radius 8px
    border-top-right-radius 8px
    z-index 1

  &__motion
    color #fff
    padding 0.5rem
    display flex
    height 1rem
    align-items center
    background rgba(255, 255, 255, 0.3)
    transition box-shadow 0.08s
    border-radius 0.5rem
    // align-self center
    margin-left 0.5rem

    &:before
      content ''
      width 8px
      height 8px
      background #4CAF50
      border-radius 2px
      margin-right 0.5rem

    &--detected
      box-shadow 0 0 0 8px rgba(255, 87, 34, 0.5)

      &:before
        background #ff4b12

  &__filters
    flex 1
    margin 0 1rem
    border none
    font-size 1rem
    color #fff
    &__item
      display flex
      align-items center

  &__back
    cursor pointer
    z-index 1
    padding 1rem 2rem
    border none
    border-radius 4px
    height 48px
    background #fff
    box-shadow 0 2px 5px 0 rgba(0, 0, 0, 0.3)

.motion-detector
  display none

input[type=range]
  -webkit-appearance none
  margin 10px 0
  width 100%

input[type=range]:focus
  outline none

input[type=range]::-webkit-slider-runnable-track
  width 100%
  height 4px
  cursor pointer
  animate 0.2s
  background #fff
  border-radius 20px
  border 0.2px solid #010101
  transition 0.2s ease-in-out

input[type=range]::-webkit-slider-thumb
  height 14px
  width 14px
  border-radius 50px
  background #fff
  cursor pointer
  -webkit-appearance none
  margin-top calc(-14px / 2 + 2px)
  transition 0.2s cubic-bezier(0.39, 0.01, 0.5, 5)

input[type=range]:focus::-webkit-slider-thumb
  height 18px
  width 18px
  margin-top -7px
  transition 0.2s cubic-bezier(0.39, 0.01, 0.5, 5)

input[type=range]:focus::-webkit-slider-runnable-track
  background #fff
  transition 0.2s ease-in-out
</style>
