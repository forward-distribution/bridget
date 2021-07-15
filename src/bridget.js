import bridge from './bridge/bridge.js'

function applyStyles() {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(
    document.createTextNode('header.fp-main-header {display:none;}')
  )
  style.appendChild(
    document.createTextNode('footer[data-t-name="Footer"] {display:none;}')
  )
  document.head.append(style)
}

function isInternalLink(url, host) {
  return url.host === host
}

// This is a placeholder check for testing purposes on BMG. It would ideally
// be replaced by a client-side regex detailing what we should look for in an
// article.

function isArticle(url) {
  const re = /^[a-zA-Z-]+-[0-9]+$', 'g'/
  return re.test(url.split('/').pop())
}

const navigationObjectResolver = href => {
  const location = window.location
  const constructedUrl = new URL(href, location.origin)
  const pathname = constructedUrl.pathname

  if (isInternalLink(constructedUrl, location.host)) {
    if (isArticle(pathname)) {
      return { type: 'article', url: pathname }
    }
    return pathname === '/' ? { type: 'startpage' } : { type: 'page', url: pathname }
  }

  return { type: 'external', url: href }
}

const linkingHandler = event => {
  event.preventDefault()
  const element = event.target.closest('a')
  const navigationObject = navigationObjectResolver(element.href)
  const { type, url } = navigationObject

  switch (type) {
    case 'article': {
      bridge.navigateToArticle(url)
      break
    }
    case 'page': {
      bridge.navigateToPage(url)
      break
    }
    case 'startpage': {
      bridge.navigateToStartpage()
      break
    }
    case 'external': {
      bridge.navigateExternally(url)
      break
    }
  }
}

if (window.ReactNativeWebView) {
  applyStyles()
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', e => {
      const element = e.target.closest('a')
      element.addEventListener('click', linkingHandler, { once: true })
    }, { capture: true })
  })
}
