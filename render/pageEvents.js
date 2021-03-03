const { defaultDenyOrigins, defaultDenyResources } = require('../config')
const { ID } = require('../ids')

module.exports = { onRequest }

// https://hackernoon.com/tips-and-tricks-for-web-scraping-with-puppeteer-ed391a63d952

function onRequest(req, options = {}) {
  let origin = ''
  try {
    origin = new URL(req.url()).origin
  } catch (e) {}

  const denyResources = options[ID.optDenyResources] || defaultDenyResources
  const denyOrigins = options[ID.optDenyOrigins] || defaultDenyOrigins
  const resourceType = req.resourceType()

  if (
    !origin ||
    denyResources.indexOf(resourceType) !== -1 ||
    denyOrigins.some((deny) => origin.indexOf(deny) !== -1)
  ) {
    req.abort()
  } else {
    req.continue()
  }
}
