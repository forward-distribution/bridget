import schemaValidator, {
  schemaIds,
  validateBeforeCall
} from '../schema/schema.js'

const v = schemaValidator()

const bridge = {}

const fireAction = (action) => {
  console.log('Firing action', action.type)
  window && window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
    JSON.stringify(action))
}

bridge.navigateToArticle = path => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'navigate',
      payload: {
        to: 'article',
        path
      }
    })
  )
}

bridge.navigateToPage = path => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'navigate',
      payload: {
        to: 'page',
        path
      }
    })
  )
}

bridge.navigateToStartpage = () => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'navigate',
      payload: {
        to: 'startpage'
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

bridge.shareArticle = spec => {
  validateBeforeCall(schemaIds.shareArticle, spec, v, () => fireAction({
    type: 'shareArticle',
    payload: spec
  })
  )
}

export default bridge
