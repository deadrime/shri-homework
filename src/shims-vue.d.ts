declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.svg' {
  const svg: any;
  export default svg;
}

declare module '*.json' {
  const json: any;
  export default json;
}
