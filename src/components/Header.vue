<template>
  <header class="page_header">
    <div class="page_header__logo"/>
    <nav :class="active ? 'page_header__nav page_header__nav--active' : 'page_header__nav'">
      <a 
        class="page_header__nav__item page_header__nav__item--active" 
        href="#">Сводка</a>
      <a 
        class="page_header__nav__item" 
        href="#">Устройства</a>
      <a 
        class="page_header__nav__item" 
        href="#">Сценарии</a>
    </nav>
    <div 
      :class="active ? 'burger burger--active' : 'burger'" 
      @click="toggleActive">
      <div class="burger__menu"/>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      active: false
    }
  },
  methods: {
    toggleActive() {
      this.active = !this.active
    }
  }
})
</script>

<style lang="stylus" scoped>

.page_header
  min-height 92px
  position relative
  display flex
  justify-content space-between
  align-items center
  border-bottom 1px solid #F0F0F0
  padding 0 1.25rem

  &__logo
    background url('../assets/logo.svg') no-repeat center
    background-size 100%
    width 110px
    height 37px

  &__nav
    display none
    position absolute
    width 100%
    padding 0
    z-index 999
    background #fff
    margin 0
    box-sizing border-box
    left 0
    top 100%
    flex-direction column
    box-shadow 0 2px 6px 0 rgba(197, 186, 186, 0.5)

    &--active
      display flex

    &__item
      text-decoration none
      font-weight bold
      font-size 16px
      color #333333
      opacity 0.6
      padding 20px
      text-align center
      box-shadow inset 0 1px rgba(0, 0, 0, 0.1)

      &--active
        opacity 1

.burger
  display flex
  align-items center
  width 16px
  height 14px
  cursor pointer

  &__menu, &__menu:before, &__menu:after
    transition all 0.35s cubic-bezier(0.23, 1, 0.32, 1)
    content ''
    width 16px
    height 2px
    border-radius 2px
    background #333

  &__menu
    position relative

    &:before, &:after
      position absolute

    &:before
      top 5px

    &:after
      top -5px

  &--active
    .burger__menu
      background rgba(0, 0, 0, 0)

      &:before
        transform rotate(135deg)
        top 0

      &:after
        transform rotate(-135deg)
        top 0

@media screen and (min-width: 750px)
  .page_header
    padding 0 1.25rem

  .page_header__nav
    top 0
    display flex
    flex-direction row
    position relative
    width auto
    margin-right auto
    box-shadow none
    padding-left 10px

    &__item
      box-shadow none

  .burger
    display none
</style>
