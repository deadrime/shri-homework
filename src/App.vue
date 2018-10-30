<template>
  <div id="app">
    <AppHeader/>
    <div class="page-content">
      <router-view/>
    </div>
    <AppFooter/>
  </div>
</template>

<script lang="ts">
import Events from './components/Events.vue'
import AppHeader from './components/Header.vue'
import AppFooter from './components/Footer.vue'

export default {
  name: 'YandexSmartHome',
  components: {
    Events,
    AppHeader,
    AppFooter,
  }
}
</script>

<style lang="stylus">
html, body
  margin 0
  padding 0
  font-size 16px

.page-content
  padding 0 20px

#app
  font-family Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

@media screen and (min-width: 750px)
  .page-content
    padding 0 40px
</style>
