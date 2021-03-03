/* eslint-disable more/no-window */
const puppeteer = require('puppeteer-core')
const { isHtml } = require('../links/helpers')
const { getUrlKey, getLocationOnClick } = require('../links')
const { onRequest } = require('./pageEvents')
const { ID } = require('../ids')
const {
  defaultBrowserLaunchOptions,
  defaultPageNavigationOptions,
} = require('../config')

module.exports = {
  launchBrowser,
  renderPage,
}

let browser

async function launchBrowser() {
  try {
    browser = await puppeteer.launch(defaultBrowserLaunchOptions)
    console.log(
      `launch chromium: ${JSON.stringify(defaultBrowserLaunchOptions, null, 2)}`
    )
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
}

async function renderPage({ url = '', selector = '', key = '', options = {} }) {
  let page

  try {
    const pageNavigationOptions = {
      ...defaultPageNavigationOptions,
      ...options[ID.optPageNavigation],
    }

    page = await browser.newPage()

    const ua =
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36'
    await await page.setUserAgent(ua)

    await page.setCacheEnabled(true)
    await page.setRequestInterception(true)

    page.on('request', onRequest)

    let pageResponse = await page.goto(url, pageNavigationOptions)
    if (!isHtml(pageResponse)) {
      throw new Error('Url content is not text/html')
    }

    const resCode = pageResponse.status()

    if (selector && resCode < 400) {
      const link = await getLocationOnClick({ url, selector, page, options })
      if (!link) {
        throw new Error('getLocationOnClick: external or broken location')
      }

      url = link
      key = getUrlKey({ url })
    }

    const response = {
      url,
      key,
      status: resCode < 400 ? 'OK' : 'ERROR',
      code: resCode < 400 ? 200 : resCode,
    }

    if (resCode >= 400) {
      await page.close()
      return response
    }

    const html = await page.content()
    if (html) response.html = html

    await page.close()
    return response
  } catch (e) {
    if (page) {
      await page.close()
    }
    const error = e.message || e
    console.error(`ERROR renderPage [${url}]: ${e.stack}`)
    return {
      status: 'ERROR',
      code: 400,
      error,
    }
  }
}
