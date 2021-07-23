import schemaValidator, {
  schemaIds,
  validateBeforeCall
} from '../schema'

const v = schemaValidator()

const bridge = {}

const fireAction = (action) => {
  console.log('Firing action', action.type)
  window && window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
    JSON.stringify(action))
}

bridge.navigateToDoc = path => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'navigate',
      payload: {
        to: 'document',
        path
      }
    })
  )
}

bridge.navigateExternally = url => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'navigate',
      payload: {
        to: 'external',
        url
      }
    })
  )
}

bridge.shareDoc = spec => {
  validateBeforeCall(schemaIds.shareDoc, spec, v, () => fireAction({
    type: 'shareDoc',
    payload: spec
  })
  )
}

export default bridge
