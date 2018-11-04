<template>
  <div>
    <h1> Счетчик: {{counter}} </h1>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>

<script>
import Vue from 'vue'
import Store from '@/store'

export default Vue.extend({
  data() {
    return {
      counter: null
    }
  },
  created() {
    this.counter = Store.state.counter
    Store.subscribe(state => {
      this.counter = state.counter
    })
  },
  methods: {
    increment() {
      Store.run('increment')
    },
    decrement() {
      Store.run('decrement')
    }
  }
})
</script>
