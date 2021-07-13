import bridge from './bridge/bridge.js'

const linkingHandler = event => {
  event.preventDefault()
  const element = event.target.closest('a')
  // alert('Found anchor tag ! :D')
  console.log('ISE: ', element)

  bridge.navigateExternally(element.href)
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
      element.addEventListener('click', linkingHandler, { once: true })

      // setTimeout(() => element.removeEventListener('click', linkingHandler), 500)
    }, { capture: true })
  })
} else {
  // alert('Window with React Native Webview not available. Plz fix m8 !')
}

export default bridge
