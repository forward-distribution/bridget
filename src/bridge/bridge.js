import schemaValidator, {
  schemaIds,
  validateBeforeCall
} from '../schema/schema.js'

const v = schemaValidator()

const data_objects = ['data-webview-share']

const findNearestParentWithOnClick = element => {
  let parent = element

  while (parent !== null && parent.tagName.toLowerCase() !== 'a' && parent.target.dataset.contains(data_objects.some())) {
    parent = parent.parentNode
  }

  return parent
}

const fnc = e => {
  alert('Found anchor tag ! :D')
  console.log('ISE: ', e.target)
  // abortController.abort()
}

if (window.ReactNativeWebView) {
  // document.addEventListener('DOMContentLoaded', () => {
  //   // alert('DOM loaded successfully !')
  //   const anchors = document.querySelectorAll('a')
  //   console.log('ISE: ', anchors)
  //   Array.from(anchors).map(a => a.addEventListener('click', e => {
  //     alert('Caught on click event !')
  //     alert(e)
  //   }))
  // })
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', e => {
      // alert('A click event has been invoked ! :O')
      // is anchor
      // console.log('ISE: event ', e)
      // console.log('ISE: target ', e.target)
      // console.log('ISE: eventPhase', e.eventPhase)
      // console.log('ISE: currentTarget', e.currentTarget)
      // console.log('ISE: fromElement', e.fromElement)
      // console.log('ISE: srcElement', e.srcElement)
      // console.log('ISE: srcElement', e.toElement)
      // console.log('ISE: ', e.target.tagName)
      const element = e.target.closest('a')
      // console.log('ISE: ', element)
      // if (element !== null && element.tagName.toLowerCase() === 'a') {
      //   // alert('Caught on click event on an anchor tag !')
      //   console.log('Found anchor tag: ', element)
      // }

      // const abortController = new AbortController()
      // const signal = abortController.signal
      element.addEventListener('click', fnc)

      setTimeout(() => element.removeEventListener('click', fnc, false), 500)
    }, { capture: true })
  })
} else {
  // alert('Window with React Native Webview not available. Plz fix m8 !')
}

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
