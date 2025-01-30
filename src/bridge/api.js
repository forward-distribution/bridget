import shareDocValidator from '../compiled-schema/shareDoc.cjs'
import contentRectangleValidator from '../compiled-schema/contentRectangle.cjs'
import nativeActionValidator from '../compiled-schema/nativeAction.cjs'

export default conduit => {
  const validateBeforeCall = (validator, spec, fn) => {
    if (validator(spec)) {
      fn()
    } else {
      for (const error of validator.errors) {
        console.error(error)
      }
    }
  }

  const fireAction = action => {
    if (conduit?.postMessage != null) {
      console.log('Firing action', action.type)
      conduit.postMessage(JSON.stringify(action))
      return true
    }
    return false
  }

  const navigateToDoc = path => {
    fireAction({
      type: 'navigate',
      payload: {
        to: 'document',
        path,
      },
    })
  }

  const navigateExternally = url => {
    fireAction({
      type: 'navigate',
      payload: {
        to: 'external',
        url,
      },
    })
  }

  const shareDoc = spec => {
    validateBeforeCall(shareDocValidator, spec, () =>
      fireAction({
        type: 'shareDoc',
        payload: spec,
      }),
    )
  }

  const propagateDocumentMetadata = spec => {
    validateBeforeCall(shareDocValidator, spec, () =>
      fireAction({
        type: 'propagateDocumentMetadata',
        payload: spec,
      }),
    )
  }

  const propagateContentRectangle = spec => {
    validateBeforeCall(contentRectangleValidator, spec, () =>
      fireAction({
        type: 'propagateContentRectangle',
        payload: spec,
      }),
    )
  }

  const propagateNativeAction = spec => {
    validateBeforeCall(nativeActionValidator, spec, () =>
      fireAction({
        type: 'propagateNativeAction',
        payload: spec,
      }),
    )
  }

  const isActive = () =>
    window.Kildare != null || window.ReactNativeWebView != null

  return {
    isActive,
    propagateNativeAction,
    propagateContentRectangle,
    propagateDocumentMetadata,
    shareDoc,
    navigateToDoc,
    navigateExternally,
    services: conduit?.services || {},
  }
}
