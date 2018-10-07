<template>
  <div id="app">
    <AppHeader/>
    <div class="page-content">
      <h1 class="page-title">Лента событий</h1>
      <Events/>
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

.page-title
  font-size 1.5rem
  margin 1.125rem 0
  color #333333

#app
  font-family Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

@media screen and (min-width: 750px)
  .page-content
    padding 0 40px

  .page-title
    margin 2.125rem 0 2rem
    font-size 2.25rem
</style>
