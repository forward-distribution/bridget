import shareDocValidator from '../compiled-schema/shareDoc.cjs'
import contentRectangleValidator from '../compiled-schema/contentRectangle.cjs'
import nativeActionValidator from '../compiled-schema/nativeAction.cjs'

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
  console.log('Firing action', action.type)
  window &&
    window.ReactNativeWebView &&
    window.ReactNativeWebView.postMessage(JSON.stringify(action))
}

export const navigateToDoc = path => {
  fireAction({
    type: 'navigate',
    payload: {
      to: 'document',
      path,
    },
  })
}

export const navigateExternally = url => {
  fireAction({
    type: 'navigate',
    payload: {
      to: 'external',
      url,
    },
  })
}

export const shareDoc = spec => {
  validateBeforeCall(shareDocValidator, spec, () =>
    fireAction({
      type: 'shareDoc',
      payload: spec,
    }),
  )
}

export const propagateDocumentMetadata = spec => {
  validateBeforeCall(shareDocValidator, spec, () =>
    fireAction({
      type: 'propagateDocumentMetadata',
      payload: spec,
    }),
  )
}

export const propagateContentRectangle = spec => {
  validateBeforeCall(contentRectangleValidator, spec, () =>
    fireAction({
      type: 'propagateContentRectangle',
      payload: spec,
    }),
  )
}

export const propagateNativeAction = spec => {
  validateBeforeCall(nativeActionValidator, spec, () =>
    fireAction({
      type: 'propagateNativeAction',
      payload: spec,
    }),
  )
}

export const isActive = () =>
  window.Klidare != null || window.ReactNativeWebView != null
