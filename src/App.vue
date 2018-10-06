<template>
  <div id="app">
    <Events/>
  </div>
</template>

<script>
import Events from './components/Events'

export default {
  name: 'YandexSmartHome',
  components: {
    Events
  }
}
</script>

<style lang="stylus">
  html
    font-size 16px

  #app
    font-family Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale

</style>
