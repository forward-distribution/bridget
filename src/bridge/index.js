import bridge from './api.js'

const applyLinkingListener = () => {
  document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', e => {
      const element = e.target.closest('a')
      element && element.addEventListener('click', linkingHandler, { once: true })
    }, { capture: true })
  })
}

const applyStyles = () => {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(
    document.createTextNode('.fp-bridget__webview-hidden {display:none;}')
  )
  document.head.append(style)
}

const getElementContentByPropSelector = ({ element, prop, value, innerHtml = false, attribute = 'content' }) => {
  // Content is sometimes inside the tag as an attribute, or between the tag as inner content
  return innerHtml ? document.querySelector(`${element}[${prop}^='${value}']`)?.innerHTML : document.querySelector(`${element}[${prop}^='${value}']`)?.getAttribute(attribute)
}

const getAllElementsByPropSelector = ({ element, prop, value }) => {
  return document.querySelectorAll(`${element}[${prop}^='${value}']`) || []
}

const extractDocMetadata = () => {
  // get defaults first
  const title = document.title || ''
  const description = getElementContentByPropSelector({ element: 'meta', prop: 'name', value: 'description' }) || ''
  const cannonicalUrl = getElementContentByPropSelector({ element: 'link', prop: 'rel', value: 'canonical', attribute: 'href' })
  const url = cannonicalUrl || document.location.href
  // check for LDJson linked data, return that if present
  const LDJson = getElementContentByPropSelector({ element: 'script', prop: 'type', value: 'application/ld+json', innerHtml: true })
  if (LDJson) {
    const documentMeta = JSON.parse(LDJson)
    const { headline, description, mainEntityOfPage } = documentMeta
    return { title: headline, description, url: mainEntityOfPage['@id'] }
  }
  const openGraphData = Array.from(getAllElementsByPropSelector({ element: 'meta', prop: 'property', value: 'og:' }))
  const hasOpenGraph = openGraphData.length
  // check for OpenGraph linked data, return that if LDJson not present
  if (hasOpenGraph) {
    let graphData = {}
    openGraphData.forEach(item => {
      if (item.hasAttribute('property') && item.hasAttribute('content')) {
        const property = item.getAttribute('property')
        const content = item.getAttribute('content')
        graphData = { ...graphData, [`${property.replace('og:', '')}`]: content }
      }
    })
    const { title, description, url } = graphData
    return { title, description, url }
  }
  // return defaults if previous metadata is not available
  return { title, description, url }
}

const isInternalLink = (url, host) => {
  return url.host === host
}

const isSharingLink = (element) => {
  return element.classList.contains('fp-bridget__webview-social')
}

const actionFromElementLinkType = element => {
  const { href } = element
  const location = window.location
  const constructedUrl = new URL(href, location.origin)
  const { href: url, pathname } = constructedUrl

  if (isInternalLink(constructedUrl, location.host)) {
    return pathname === '/' ? { type: 'startpage' } : { type: 'document', spec: { url } }
  } else if (isSharingLink(element)) {
    const docMeta = extractDocMetadata()
    return { type: 'share', spec: docMeta }
  }
  return { type: 'external', spec: { url: href } }
}

const linkingHandler = event => {
  event.preventDefault()
  const element = event.target.closest('a')
  const actionObject = actionFromElementLinkType(element)
  const { type, spec } = actionObject

  switch (type) {
    case 'document': {
      bridge.navigateToDoc(spec.url)
      break
    }
    case 'external': {
      bridge.navigateExternally(spec.url)
      break
    }
    case 'share': {
      bridge.shareDoc(spec)
      break
    }
  }
}

export const initBridget = (opts = {}) => {
  applyStyles()
  applyLinkingListener()
}
