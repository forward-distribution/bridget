const getElementContentByPropSelector = ({
  element,
  prop,
  value,
  innerHtml = false,
  attribute = 'content',
}) => {
  // Content is sometimes inside the tag as an attribute, or between the tag as inner content
  return innerHtml
    ? document.querySelector(`${element}[${prop}^='${value}']`)?.innerHTML
    : document
        .querySelector(`${element}[${prop}^='${value}']`)
        ?.getAttribute(attribute)
}

const getAllElementsByPropSelector = ({ element, prop, value }) => {
  return document.querySelectorAll(`${element}[${prop}^='${value}']`) || []
}

const isInternalLink = (url, host) => {
  return url.host === host
}

const isSharingLink = element => {
  return element.classList.contains('fp-bridget__webview-social')
}

const filterObjectFromNullValues = obj => {
  const result = {}
  for (const p in obj) {
    if (obj[p] != null) {
      result[p] = obj[p]
    }
  }
  return result
}

export {
  getElementContentByPropSelector,
  getAllElementsByPropSelector,
  filterObjectFromNullValues,
  isInternalLink,
  isSharingLink,
}
