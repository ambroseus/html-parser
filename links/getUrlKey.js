const crypto = require('crypto')

module.exports = {
  getUrlKey,
}

function getUrlKey({ url, selector = '' }) {
  const urlKey = crypto
    .createHash('sha256')
    .update(url + selector)
    .digest('hex')

  return urlKey
}
