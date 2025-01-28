import { initBridget, isActive } from './bridge/index.js'

if (isActive()) {
  console.log('<--- Initializing Bridget --->')
  initBridget()
}
