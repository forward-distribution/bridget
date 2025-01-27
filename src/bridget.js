import { initBridget } from './bridge/index.js'
import bridge from './bridge/api.js'

const isWebview = () => !!window.ReactNativeWebView

if (isWebview()) {
  console.log('<--- Initializing Bridget --->')
  initBridget()
}

export { isWebview, bridge }
export default { isWebview, bridge }
