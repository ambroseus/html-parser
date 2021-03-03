const normalizeUrl = require('normalize-url')
const { defaultNormalizeUrlOptions, defaultDenyOrigins } = require('../config')
const { ID } = require('../ids')

module.exports = { getNormalizedUrl }

function getNormalizedUrl({ url, options = {} }) {
  try {
    const normalizeOptions = {
      ...defaultNormalizeUrlOptions,
      ...options[ID.optNormalizeUrl],
    }

    url = (url || '').trim().replace(/;jsessionid=.*$/i, '')

    const normalizedUrl = normalizeUrl(url, normalizeOptions)
    const { origin } = new URL(normalizedUrl)

    const denyOrigins = options[ID.optDenyOrigins] || defaultDenyOrigins

    if (denyOrigins.some((deny) => origin.indexOf(deny) !== -1)) {
      return ''
    }

    return normalizedUrl
  } catch (e) {
    console.error(`NORMALIZE URL ERROR: [${url}] ${e}\n${e.stack}`)
    return ''
  }
}
