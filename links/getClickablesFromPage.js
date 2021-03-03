const { getUrlKey } = require('./getUrlKey')

module.exports = {
  getClickablesFromPage,
}

async function getClickablesFromPage({ url, page, options = {} }) {
  const xpaths = await page.$$eval('[data-clickable-xpath]', (elements) =>
    elements
      .map((el) => el.getAttribute('data-clickable-xpath'))
      .filter(Boolean)
  )

  if (xpaths.length === 0) return

  const clickables = xpaths.map((xpath) => ({
    xpath,
    key: getUrlKey({ url: url + xpath }),
  }))
  return clickables
}
