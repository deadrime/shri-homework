const cloneDeep = require('lodash/cloneDeep')

interface State {
  [key: string]: any
}

type Mutation = ({state}: {state: State}) => any

type Listener = ((newState: any, prevState: any) => any)

interface Mutations {
  [method: string]: Mutation
}

interface Reducer {
  state: State
  mutations: Mutations
}

class Store {
  public state: State
  private mutations: Mutations
  private listeners: Listener[]

  constructor({ state, mutations }: {state: State, mutations: Mutations}) {
    this.mutations = mutations
    this.state = state
    this.listeners = []
  }

  run(action: string): any {
    const prevState = this.state
    const newState = cloneDeep(this.state)
    const result = this.mutations[action]({ state: newState })
    this.state = newState
    this.listeners.forEach(cb => {
      cb(newState, prevState)
    })
    return result
  }

  getState(): State {
    return cloneDeep(this.state)
  }

  subscribe(newListener: Listener): void {
    this.listeners.push(newListener)
  }

  unsubscribe(cb: () => {}): void {
    this.listeners.splice(this.listeners.indexOf(cb), 1)
  }
}


const myStore: Reducer = {
  state: {
    counter: 0,
  },
  mutations: {
    increment({ state }) {
      state.counter += 1
    },
    decrement({ state }) {
      state.counter -= 1
    }
  }
}

let store = new Store(myStore)

export default store

