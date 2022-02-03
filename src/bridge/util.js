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

const isSharingLink = (element) => {
  return element.classList.contains('fp-bridget__webview-social')
}

const filterObjectFromNullValues = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v))
}

export {
  getElementContentByPropSelector,
  getAllElementsByPropSelector,
  filterObjectFromNullValues,
  isInternalLink,
  isSharingLink
}
