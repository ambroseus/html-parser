const { getUrlKey } = require('./getUrlKey')
const { getNormalizedUrl } = require('./getNormalizedUrl')
const { getAllLinks, withKey } = require('./getAllLinks')
const { getLinksFromPage } = require('./getLinksFromPage')
const { getClickablesFromPage } = require('./getClickablesFromPage')
const { getLocationOnClick } = require('./getLocationOnClick')

module.exports = {
  getUrlKey,
  getNormalizedUrl,
  getAllLinks,
  withKey,
  getLinksFromPage,
  getClickablesFromPage,
  getLocationOnClick,
}
