<template>
  <div id="app">
    <AppHeader/>
    <div class="page-content">
      <router-view/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import Events from './components/Events'
import AppHeader from './components/Header'
import AppFooter from './components/Footer'

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
