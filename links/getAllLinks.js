const { normalizeLinks } = require('./helpers')
const { getUrlKey } = require('./getUrlKey')

module.exports = {
  getAllLinks,
  withKey,
}

function getAllLinks({ $, selector = 'a,area', url, options = {} }) {
  const draftLinks = []

  const elements = typeof selector === 'string' ? $(selector) : selector

  elements.each(function () {
    const href = ($(this).attr('href') || '').trim()
    if (!href || href.startsWith('#')) return
    draftLinks.push(href)
  })

  const normalizedLinks = normalizeLinks(draftLinks, url, options).filter(
    Boolean
  )

  const links = [...new Set(normalizedLinks)]

  return links
}

function withKey(url) {
  return { url, key: getUrlKey({ url }) }
}
