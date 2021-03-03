/* eslint-disable more/no-window */
const { normalizeLinks } = require('./helpers')
const { defaultPageNavigationOptions } = require('../config')
const { ID } = require('../ids')

module.exports = {
  getLocationOnClick,
}

async function getLocationOnClick({ url, xpath, page, options = {} }) {
  let link = ''
  try {
    const pageNavigationOptions = {
      ...defaultPageNavigationOptions,
      ...options[ID.optPageNavigation],
    }

    await page.waitForXPath(xpath)
    const elHandles = await page.$x(xpath)

    await Promise.all([
      page.evaluate((el) => el.click(), elHandles[0]),
      page.waitForNavigation(pageNavigationOptions),
    ])

    if (elHandles && elHandles[0]) {
      await elHandles[0].dispose() // to prevent active handles leak
    }

    await page.waitForSelector('body')
    link = await page.evaluate(() => window.location.href)

    const links = normalizeLinks([link], url, options)
    if (!links || links.length === 0) return ''
    return links[0]
  } catch (e) {
    console.error(`ERROR CLICK NAVIGATE FROM [${url}]: ${e}\n${e.stack}`)
    return ''
  }
}
