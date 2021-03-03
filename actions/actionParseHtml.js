const { getNormalizedUrl, getUrlKey } = require('../links')
const { renderPage } = require('../render')

module.exports = {
  execParseHtmlAction,
}

async function execParseHtmlAction({
  url: originalUrl,
  selector = '',
  options = {},
}) {
  const url = getNormalizedUrl({ url: originalUrl, options })
  const key = getUrlKey({ url, selector })

  const response = await renderPage({
    url,
    selector,
    key,
    options,
  })

  return response
}
