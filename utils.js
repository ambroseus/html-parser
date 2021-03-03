module.exports = {
  isObj,
  toURL,
}

function isObj(obj) {
  return typeof obj === 'object' && obj.constructor === Object
}

function toURL(url) {
  return new URL(url)
}
