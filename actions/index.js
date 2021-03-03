const { getNormalizedUrl, getUrlKey } = require('../links')
const { execParseHtmlAction } = require('./actionParseHtml')
const { execPostProcessAction } = require('./actionPostProcess')
const { isObj } = require('../utils')

module.exports = {
  actionUrlKey,
  actionParseHtml,
}

function actionUrlKey(req, res) {
  const request = req.body || {}

  try {
    const { url: originalUrl = '', selector = '', options = {} } = request

    if (!originalUrl) throw new Error("missing 'url' parameter in request")

    const url = getNormalizedUrl({ url: originalUrl, options })
    const key = getUrlKey({ url, selector })

    const response = { url, key, status: 'OK', code: 200, request }

    res.status(200).send(response)
  } catch (e) {
    const error = e.toString()
    console.error(`ERROR actionUrlKey: ${e.stack}`)

    res.status(200).send({
      status: 'ERROR',
      code: 400,
      request,
      error,
    })
  }
}

async function actionParseHtml(req, res) {
  const request = req.body || {}

  try {
    const {
      url = '',
      selector = '',
      html = '',
      postprocess,
      options = {},
    } = request

    if (!isObj(options)) throw new Error("'options' is not an object")

    let response = {}

    if (!html) {
      response = await execParseHtmlAction({
        url,
        selector,
        options,
      })
    }

    if (postprocess) {
      if (!isObj(postprocess)) throw new Error("'postprocess' is not an object")

      const htmlToPostProcess = html || response.html || ''

      const { html: outputHtml, output } = execPostProcessAction({
        ...postprocess,
        url: response.url || url,
        html: htmlToPostProcess,
        options,
      })

      if (outputHtml) response.html = outputHtml
      if (output) response.output = output
    }

    response.status = response.status || 'OK'
    response.code = response.code || 200

    if (html) request.html = '.....'
    if (postprocess && postprocess.handler) postprocess.handler = '.....'
    response.request = request

    res.status(200).send(response)
  } catch (e) {
    const error = e.message || e
    console.error(`ERROR actionParseHtml: ${e.stack}`)

    if (request.html) request.html = '.....'
    const postprocess = request.postprocess
    if (postprocess && postprocess.handler) postprocess.handler = '.....'

    res.status(200).send({
      status: 'ERROR',
      code: 400,
      request,
      error,
    })
  }
}
