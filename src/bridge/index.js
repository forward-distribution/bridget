import makeBridge from './api.js'
import {
  getElementContentByPropSelector,
  getAllElementsByPropSelector,
  filterObjectFromNullValues,
  isInternalLink,
  isSharingLink,
} from './util.js'

const scheduleDomContentLoadedActions = (_, bridge) => {
  document.addEventListener('DOMContentLoaded', () => {
    applyLinkingListener(bridge)
    propagateDocumentMetadata(bridge)
  })
}

const applyLinkingListener = bridge => {
  document.addEventListener(
    'click',
    e => {
      // if something else decides that the default events should be prevented
      // we take it into consideration
      if (e.defaultPrevented) return
      const element = e.target.closest('a')
      element &&
        element.addEventListener('click', userActionHandler(bridge), {
          once: true,
        })
    },
    { capture: true },
  )
}

const propagateDocumentMetadata = bridge => {
  const documentMetadata = extractDocMetadata()
  bridge.propagateDocumentMetadata(documentMetadata)
}

const applyStyles = () => {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(
    document.createTextNode('.fp-bridget__webview-hidden {display:none;}'),
  )
  document.head.append(style)
}

const extractDocMetadata = () => {
  // get defaults first
  const title = document.title || ''
  const description =
    getElementContentByPropSelector({
      element: 'meta',
      prop: 'name',
      value: 'description',
    }) || ''
  const cannonicalUrl = getElementContentByPropSelector({
    element: 'link',
    prop: 'rel',
    value: 'canonical',
    attribute: 'href',
  })
  const url = cannonicalUrl || document.location.href

  let metadata = { url, text: description, title }

  const openGraphData = Array.from(
    getAllElementsByPropSelector({
      element: 'meta',
      prop: 'property',
      value: 'og:',
    }),
  )
  const hasOpenGraph = openGraphData.length
  // check for OpenGraph linked data, override the fields that are available
  if (hasOpenGraph) {
    let graphData = {}
    openGraphData.forEach(item => {
      if (item.hasAttribute('property') && item.hasAttribute('content')) {
        const property = item.getAttribute('property')
        const content = item.getAttribute('content')
        graphData = {
          ...graphData,
          [`${property.replace('og:', '')}`]: content,
        }
      }
    })
    const { title, description, url } = graphData
    const openGraphMetadata = filterObjectFromNullValues({
      title,
      text: description,
      url,
    })
    metadata = { ...metadata, ...openGraphMetadata }
  }

  // check for LDJson linked data, override the fields that are available
  const LDJson = getElementContentByPropSelector({
    element: 'script',
    prop: 'type',
    value: 'application/ld+json',
    innerHtml: true,
  })
  if (LDJson) {
    const documentMeta = JSON.parse(LDJson)
    const { headline, description, mainEntityOfPage } = documentMeta
    const ldJsonMetadata = filterObjectFromNullValues({
      title: headline,
      text: description,
      url: mainEntityOfPage ? mainEntityOfPage['@id'] : null,
    })
    metadata = { ...metadata, ...ldJsonMetadata }
  }
  // returns default metadata for the fields that are not available through LDJSON and OpenGraph
  return metadata
}

const actionFromElementLinkType = element => {
  const { href } = element
  const location = window.location
  const constructedUrl = new URL(href, location.origin)
  const { href: url, pathname } = constructedUrl

  if (isInternalLink(constructedUrl, location.host)) {
    return pathname === '/'
      ? { type: 'startpage' }
      : { type: 'document', spec: { url } }
  } else if (isSharingLink(element)) {
    const docMeta = extractDocMetadata()
    return { type: 'share', spec: docMeta }
  }
  return { type: 'external', spec: { url: href } }
}

const userActionHandler = bridge => event => {
  // if default event was prevented, return early
  // something else handles it and no navigation should be performed
  if (event.defaultPrevented) return
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
      if (navigator.share) {
        navigator
          .share(spec)
          .then(() => {
            console.log('Web Shared successful')
          })
          .catch(e => {
            console.error(e)
          })
      } else {
        bridge.shareDoc(spec)
      }
      break
    }
  }
}

export const initBridget = (
  opts = {
    globalName: 'bridget',
    globalObject: window,
    conduits: ['Kildare', 'ReactNativeWebView'],
  },
) => {
  if (opts.globalObject[opts.globalName] == null) {
    const conduit = opts.conduits.find(c => window[c] != null)
    if (conduit != null) {
      console.log('<--- Initializing Bridget with conduit: ', conduit)
      const bridge = makeBridge(window[conduit])
      opts.globalObject[opts.globalName] = bridge
      // deprecated
      opts.globalObject[opts.globalName].bridge = bridge
      opts.globalObject[opts.globalName].isWebview = bridge.isActive

      // attachments
      applyStyles(opts, bridge)
      scheduleDomContentLoadedActions(opts, bridge)
    } else {
      opts.globalObject[opts.globalName] = {
        isActive: () => false,
        isWebview: () => false,
      }
    }
  }
}

export { makeBridge }
