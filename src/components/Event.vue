<template>
  <div :class="data.type === 'critical' ? 'event event--critical' : 'event'">
    <header class ="event__header">
      <h1 class="event__title">{{ data.title }}</h1>
      <div class="event__subheading">
        <span class="event__source">{{ data.source }}</span>
        <span class="event__time">{{ data.time }}</span>
      </div>
    </header>
    <div 
      v-if="data.size !=='s'" 
      class="event__body">
      <p class="event__description">{{ data.description }}</p>
      <img 
        v-if="data.data && data.data.image" 
        :src="data.data.image" 
        class="event__image" 
        alt="">

      <EventChart
        v-if="data.data && data.data.type==='graph'" 
        :data="data.data.values"
        class="event__chart"/>
    </div>

    <NextIcon class="icon-next"/>
  </div>
</template>

<script>
import EventChart from './chart.js'
import NextIcon from '@/assets/icons/next.svg'

export default {
  components: {
    EventChart,
    NextIcon,
  },
  props: ['data'],
  data() {
    return {

    }    
  },
}
</script>


<style lang="stylus" scoped>
.icon-next
  display none
  position absolute
  right 1.5rem
  bottom 1.5rem

.event
  text-align left 
  border-radius 1.25rem
  background #FAFAFA
  color #333333
  min-height 170px
  display flex
  flex-direction column
  overflow hidden
  position relative
  &:hover
    background #F3F3F3
    box-shadow 0 2px 6px 0 rgba(197,186,186,0.50)
    &__body
      background #F3F3F3
    .icon-next
      display block
  &__title
    font-weight bold
    font-size 1.5rem
  &__description
    font-size 1.5rem
  &__body
    padding 1.25rem
    flex 1 0
    border-top-left-radius 1.25rem
    border-top-right-radius 1.25rem
  &__header
    padding 1.25rem
  &__subheading
    font-size 1.125rem
    display flex
    justify-content space-between
    padding-top 0.875rem
  &__image
    width 100%
  &__chart
    padding-bottom 1rem


.event--small
  .event__subheading
    display flex
    flex-direction column
    padding-bottom 0
  .event__source
    padding-bottom 20px

.event--critical
  background #DB5341
  &:hover
    background #DB5341
  .event__header
    color #fff
  .event__body
    background #F3F3F3

</style>

