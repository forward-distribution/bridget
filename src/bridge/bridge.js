let bridge = {}

bridge.navigateToArticle = path => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'navigate',
      payload: {
        to: 'article',
        path,
      },
    }),
  )
}

bridge.navigateToPage = path => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'navigate',
      payload: {
        to: 'page',
        path,
      },
    }),
  )
}

bridge.navigateToStartpage = () => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'navigate',
      payload: {
        to: 'startpage',
      },
    }),
  )
}

bridge.navigateExternally = url => {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      type: 'navigate',
      payload: {
        to: 'external',
        url,
      },
    }),
  )
}

export default bridge