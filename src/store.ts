import { Store } from '../flux/src'

interface InterfaceState {
  counter: number,
  test: {
    huh: string
  }
}

const myStore = {
  state: {
    counter: 0,
    test: {
      huh: 'uh'
    }
  },
  persisted: ['counter'],
  mutations: {
    increment(state: InterfaceState) {
      state.counter += 1
    },
    decrement(state: InterfaceState) {
      state.counter -= 1
    },
    test(state: InterfaceState) {
      state.test.huh += 'uh'
    }
  }
}

let store = new Store(myStore)

export default store

