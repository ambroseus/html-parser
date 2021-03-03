const { getNormalizedUrl } = require('./getNormalizedUrl')

module.exports = {
  isHtml,
  normalizeLinks,
}

function isHtml(res) {
  try {
    const type = res.headers()['content-type']
    const regex = /^text\/html/i
    return regex.test(type)
  } catch (e) {
    return false
  }
}

function normalizeLinks(draftLinks = [], parentUrl = '', options) {
  const origin = parentUrl ? new URL(parentUrl).origin : ''

  const links = draftLinks
    .map((url) => normalizeOrigin(url, parentUrl, origin))
    .filter(Boolean) // add origin to relative url

  const normalizedLinks = [...new Set(links)] // unique only
    .map((url) => getNormalizedUrl({ url, options })) // normalize url
    .filter(
      (url) => url !== origin && url !== parentUrl && originInScope(url, origin)
    ) // exclude parent and non-origin urls
    .sort(sortUrls)

  return normalizedLinks
}

function normalizeOrigin(url, parentUrl = '', origin = '') {
  url = (url || '').trim()
  if (!url) return ''

  url = url.replace(/;jsessionid=.*$/i, '')

  // normalize relative url
  const protocol = /^https?:\/\//i
  const skip = /^(.+:)|(#)/i

  if (!protocol.test(url)) {
    if (url.startsWith('/')) {
      url = `${origin}${url}`
    } else {
      if (!skip.test(url)) {
        url = `${parentUrl}/${url}`
      } else {
        url = ''
      }
    }
  }

  try {
    // eslint-disable-next-line
    const check = new URL(url).origin
    return url
  } catch (e) {
    return ''
  }
}

function originInScope(url, origin) {
  try {
    const urlOrigin = new URL(url).origin
    return urlOrigin === origin
  } catch (e) {
    return false
  }
}

function sortUrls(a, b) {
  const aPath = pathLength(a)
  const bPath = pathLength(b)

  if (aPath < bPath) return -1
  if (aPath > bPath) return 1

  if (a.length < b.length) return -1
  if (a.length > b.length) return 1
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

function pathLength(url) {
  const path = new URL(url).pathname.split('/')
  return path.length
}
