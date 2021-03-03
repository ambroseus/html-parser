const ID = {
  actGetUrlKey: 'getUrlKey',
  actGetHtml: 'getHtml',
  actParseHtml: 'parseHtml',
  //actGetLinks: 'getLinks',
  //actGetClickables: 'getClickables',
  optPageNavigation: 'pageNavigation',
  optNormalizeUrl: 'normalizeUrl',
  optSanitizeHtml: 'sanitizeHtml',
  optDenyResources: 'denyResources',
  optDenyOrigins: 'denyOrigins',
}

const ACTIONS = [
  ID.actGetUrlKey,
  ID.actGetHtml,
  //ID.actGetLinks,
  //ID.actGetClickables,
  ID.actParseHtml,
]

module.exports = { ID, ACTIONS }

// getUrlKey
const getUrlKey = {
  url: '://', // mandatory
  selector: '>', // optional
}

// getHtml
const getHtml = {
  url: '://', // mandatory
  selector: '>', // optional
  html: '</>', // optional
  postprocess: {
    // optional
    script: ';', // mandatory
    input: '{}', // optional
  },
}
