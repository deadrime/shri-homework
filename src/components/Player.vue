<template>
  <div class="player">
    <div class="player__song-area">
      <img 
        :src="song.albumcover"
        alt="" 
        class="player__albumcover">
      <div class="player__top-control">
        <span class="player__song-title">{{ songName }}</span>
        <div class="player__time-slider__wrapper">
          <div class="player__time-slider">
            <div class="player__time-slider__line"/>
            <div class="player__time-slider__controller"/>
          </div>
          <span class="player__time-slider__time">{{ song.track.length }}</span>
        </div>
      </div>
    </div>
    <div class="player__bottom">
      <div class="player__prev-next">
        <PrevNextIcon 
          class="icon-next" 
          tabindex="0"/>
        <PrevNextIcon 
          class="icon-prev"
          tabindex="0"/>
      </div>
      <div class="player__volume-slider">
        <div class="player__volume-slider__line"/>
        <div class="player__volume-slider__controller"/>
      </div>
      <div class="player__volume-slider__volume">80%</div>
    </div>
  </div>
</template>

<script lang="ts">
// import PrevNextIcon from '@/assets/player/Prev.svg?inline'
const PrevNextIcon = require('@/assets/player/Prev.svg?inline')
import Vue from 'vue';

export default Vue.extend({
  components: {
    PrevNextIcon
  },
  props: {
    song: Object,
  },
  computed: {
    songName(): string {
      return this.song.artist + ' - ' + this.song.track.name
    }
  }
})
</script>

<style lang="stylus" scoped>
.icon-prev
  cursor pointer
  transform rotate(180deg)

.player
  &__song-area
    display flex
    align-items center
    height 3.25rem

  &__prev-next
    width 8.25rem
    display flex
    justify-content space-between

  &__song-title
    width 100%
    font-size 1.125rem
    white-space nowrap
    overflow hidden
    text-overflow ellipsis

  &__albumcover
    width 3.25rem
    height 3.25rem
    border-radius 0.5rem

  &__top-control
    overflow hidden
    padding-left 1rem
    height 100%
    width 100%
    display flex
    flex-direction column
    justify-content space-between

  &__time-slider
    width 100%
    display flex
    align-items center
    height 20px
    position relative

    &__wrapper
      display flex

    &__line
      display block
      width 100%
      height 2px
      background #979797

    &__time
      font-family Helvetica, serif
      font-size 0.875rem
      padding-left 1rem
      color rgba(161, 161, 161, 0.84)

    &__controller
      cursor pointer
      width 12px
      height 100%
      background #D8D8D8
      border-radius 4.5px
      position absolute
      left 10%

  &__bottom
    padding-bottom 0.5rem
    display flex
    align-items center
    padding-top 1.25rem

  &__volume-slider
    flex 1
    display flex
    align-items center
    position relative

    &__line
      margin-left 0.875rem
      height 4px
      border-radius 2px
      width 100%
      background rgba(216, 216, 216, 0.3)

    &__volume
      display block
      font-size 0.875rem
      padding-left 1.25rem
      color rgba(161, 161, 161, 0.84)

    &__controller
      cursor pointer
      position absolute
      border-radius 50%
      left 80%
      width 16px
      height 16px
      background #605757

@media screen and (min-width: 750px)
  .player
    &__song-title
      font-size 1.25rem
</style>

