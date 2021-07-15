import bridge from './api.js'

function hijackLinking() {
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', e => {
      const element = e.target.closest('a')
      element && element.addEventListener('click', linkingHandler, { once: true })
    }, { capture: true })
  })
}

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

function extractArticleMetadata() {
  const documentMeta = JSON.parse(document.querySelector("script[type='application/ld+json']").innerHTML)
  const { headline, description, mainEntityOfPage } = documentMeta

  return { title: headline, description, url: mainEntityOfPage['@id'] }
}

function isInternalLink(url, host) {
  return url.host === host
}

function isSharingLink(element) {
  const { service } = element.dataset
  console.log('dataset', element.dataset)
  return service
}

// This is a placeholder check for testing purposes on BMG. It would ideally
// be replaced by a client-side regex detailing what we should look for in an
// article.

function isArticle(url) {
  const re = /^[a-zA-Z-]+-[0-9]+$', 'g'/
  return re.test(url.split('/').pop())
}

const actionFromElementLinkType = element => {
  const { href } = element
  const location = window.location
  const constructedUrl = new URL(href, location.origin)
  const pathname = constructedUrl.pathname

  if (isInternalLink(constructedUrl, location.host)) {
    if (isArticle(pathname)) {
      return { type: 'article', spec: { url: pathname } }
    }
    return pathname === '/' ? { type: 'startpage' } : { type: 'page', spec: { url: pathname } }
  } else if (isSharingLink(element)) {
    const articleMeta = extractArticleMetadata()
    return { type: 'share', spec: articleMeta }
  }
  return { type: 'external', spec: { url: href } }
}

const linkingHandler = event => {
  event.preventDefault()
  const element = event.target.closest('a')
  const actionObject = actionFromElementLinkType(element)
  const { type, spec } = actionObject

  switch (type) {
    case 'article': {
      bridge.navigateToArticle(spec.url)
      break
    }
    case 'page': {
      bridge.navigateToPage(spec.url)
      break
    }
    case 'startpage': {
      bridge.navigateToStartpage()
      break
    }
    case 'external': {
      bridge.navigateExternally(spec.url)
      break
    }
    case 'share': {
      bridge.shareArticle(spec)
      break
    }
  }
}

export function initBridget(opts = {}) {
  applyStyles()
  hijackLinking()
}
