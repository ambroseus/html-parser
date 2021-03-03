const { normalizeLinks } = require('./helpers')
const { getUrlKey } = require('./getUrlKey')

module.exports = { getLinksFromPage }

async function getLinksFromPage({ url, page, options = {} }) {
  const draftLinks = await page.$$eval('a,area', (elements) =>
    elements.map((el) => el.href).filter(Boolean)
  )

  const normalizedLinks = normalizeLinks(draftLinks, url, options).filter(
    Boolean
  )
  const normalized = [...new Set(normalizedLinks)]

  if (normalized.length === 0) return

  const links = normalized.map((url) => ({ url, key: getUrlKey({ url }) }))
  return links
}
