import schemaValidator, { schemaIds, validateBeforeCall } from '../schema'

const v = schemaValidator()

const bridge = {}

const fireAction = (action) => {
  console.log('Firing action', action.type)
  window &&
    window.ReactNativeWebView &&
    window.ReactNativeWebView.postMessage(JSON.stringify(action))
}

bridge.navigateToDoc = (path) => {
  fireAction({
    type: 'navigate',
    payload: {
      to: 'document',
      path
    }
  })
}

bridge.navigateExternally = (url) => {
  fireAction({
    type: 'navigate',
    payload: {
      to: 'external',
      url
    }
  })
}

bridge.shareDoc = (spec) => {
  validateBeforeCall(schemaIds.shareDoc, spec, v, () =>
    fireAction({
      type: 'shareDoc',
      payload: spec
    })
  )
}

bridge.propagateDocumentMetadata = (spec) => {
  validateBeforeCall(schemaIds.shareDoc, spec, v, () =>
    fireAction({
      type: 'propagateDocumentMetadata',
      payload: spec
    })
  )
}

bridge.propagateContentRectangle = (spec) => {
  validateBeforeCall(schemaIds.contentRectangle, spec, v, () =>
    fireAction({
      type: 'propagateContentRectangle',
      payload: spec
    })
  )
}

bridge.propagateNativeAction = (spec) => {
  validateBeforeCall(schemaIds.nativeAction, spec, v, () =>
    fireAction({
      type: 'propagateNativeAction',
      payload: spec
    })
  )
}

export default bridge
