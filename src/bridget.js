import { initBridget } from './bridge'
import bridge from './bridge/api'

const isWebview = () => !!window.ReactNativeWebView

if (isWebview()) {
  console.log('<--- Initializing Bridget --->')
  initBridget()
}

export { isWebview, bridge }
export default { isWebview, bridge }
