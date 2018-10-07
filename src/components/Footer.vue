<template>
  <footer class="page-footer">
    <nav class="page-footer__nav">
      <a 
        class="page-footer__nav__item" 
        href="#">Помощь</a>
      <a 
        class="page-footer__nav__item" 
        href="#">Обратная связь</a>
      <a 
        class="page-footer__nav__item" 
        href="#">Разработчикам</a>
      <a 
        class="page-footer__nav__item" 
        href="#">Условия использования</a>
    </nav>
    <span class="page-footer__copyright">© 2001–2017  ООО «Яндекс»</span>
  </footer>
</template>

<style lang="stylus" scoped>
.page-footer
  width 100%
  height 64px
  padding 0 1.25rem
  box-sizing border-box
  display flex
  flex-wrap wrap
  margin-top auto
  justify-content space-between
  align-items center

  &__nav
    display flex

    &__item
      text-decoration none
      font-size 12px
      color #858585
      letter-spacing 0.01px
      padding-right 10px

  &__copyright
    font-size 12px
    color #858585
    letter-spacing 0.01px

@media screen and (min-width: 750px)
  .page-footer
    padding 0 2.5rem
</style>
