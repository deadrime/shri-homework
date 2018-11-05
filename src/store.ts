import {Store, Reducer} from "store"


const myStore: Reducer = {
  state: {
    counter: localStorage.getItem('counter') || 0,
  },
  mutations: {
    increment({ state }) {
      state.counter += 1
      localStorage.setItem('counter',state.counter)
    },
    decrement({ state }) {
      state.counter -= 1
      localStorage.setItem('counter',state.counter)
    }
  }
}

let store = new Store(myStore)

export default store

