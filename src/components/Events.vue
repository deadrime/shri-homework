<template>
  <div class="events-wrapper">
    <Event 
      v-for="(item, index) of events" 
      :key="index" 
      :class="eventClass(item.size)" 
      :data="item"/>
  </div>
</template>

<script>
import data from '@/events.json'
import Event from '@/components/Event'

export default {
  components: {
    Event,
  },
  data() {
    return {
      events: data.events,
    }
  },
  methods: {
    eventClass(size) {
      switch(size) {
        case 's': return 'event event--small'
        case 'm': return 'event event--medium'
        case 'l': return 'event event--large'
      }
    }
  },
}
</script>


<style lang="stylus" scoped>
.events-wrapper
  max-width 1200px
  margin 1em auto
  display grid
  grid-auto-flow dense
  grid-template-columns repeat(1, 1fr)
  grid-column-gap 1.25rem
  grid-row-gap 1.25rem

@media screen and (min-width: 750px)
  .events-wrapper
    grid-template-columns repeat(2, 1fr)
  .event--large, .event--medium
    grid-column span 2
  
@media screen and (min-width: 1000px)
  .events-wrapper
    grid-template-columns repeat(4, 1fr)
  .event--large
    grid-column span 4
  .event--medium
    grid-column span 2
    
@media screen and (min-width: 1200px)
  .events-wrapper
    grid-template-columns repeat(6, 1fr)
  .event
    grid-column span 2
  .event--large
    grid-column span 4
    grid-row span 3
  .event--medium
    grid-column span 3

</style>
