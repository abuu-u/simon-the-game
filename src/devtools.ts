import { App, Plugin } from 'vue'

declare global {
  interface Window {
    __VUE_DEVTOOLS_GLOBAL_HOOK__: {
      Vue: App
    }
  }
}

const devtools: Plugin = {
  install(app: App) {
    if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
      window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
    }
  },
}

export { devtools }
