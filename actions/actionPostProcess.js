const normalizeWhitespace = require('normalize-html-whitespace')
const sanitizeHtml = require('sanitize-html')
const cheerio = require('cheerio')
const { VM } = require('vm2')
const { defaultVMOptions, defaultSanitizeHtmlOptions } = require('../config')
const { ID } = require('../ids')

const {
  getNormalizedUrl,
  getUrlKey,
  getAllLinks,
  withKey,
} = require('../links')

const { toURL, isObj } = require('../utils')

module.exports = {
  execPostProcessAction,
}

function execPostProcessAction({
  url = '',
  html = '',
  sanitize = false,
  handler = '',
  input: originalInput = {},
  options = {},
}) {
  if (sanitize) {
    const sanitizeHtmlOptions = {
      ...defaultSanitizeHtmlOptions,
      ...options[ID.optSanitizeHtml],
    }
    html = sanitizeHtml(normalizeWhitespace(html), sanitizeHtmlOptions)
  }

  if (!handler) return { html }

  if (!isObj(originalInput)) {
    throw new Error("'postprocess.input' is not an object")
  }

  const $ = cheerio.load(html)

  // globals
  const _ = {
    toURL,
    isObj,
    getUrlKey,
    getNormalizedUrl: ({ url }) => getNormalizedUrl({ url, options }),
    getAllLinks: (selector) =>
      getAllLinks({
        $,
        url: getNormalizedUrl({ url, options }),
        selector,
        options,
      }),
    withKey,
  }

  const input = {
    ...originalInput,
    url,
    html,
  }

  const output = {}

  const vm = new VM({
    ...defaultVMOptions,
    sandbox: { $, _, input, output },
  })

  vm.run(
    `(function({ $, _, input, output }){\n${handler}\n})({ $, _, input, output })`
  )

  return { html, output }
}
