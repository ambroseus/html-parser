/* eslint-disable more/no-hardcoded-configuration-data */
const port = process.env.PORT || 8082
const host = process.env.HOST || `http://localhost:${port}`

console.log('----------')
console.log(`port: `, port)
console.log(`host: `, host)
console.log('----------')

const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser'

const defaultVMOptions = {
  timeout: 5000, // 5 sec
  eval: false, // no eval
  wasm: false, // no wasm
  fixAsync: true, // no async
}

const defaultBrowserLaunchOptions = {
  defaultViewport: {
    width: 1600,
    height: 1200,
  },
  headless: true,
  devtools: false,
  executablePath,
  args: ['--no-sandbox', '--disable-gpu'],
}

const defaultPageNavigationOptions = {
  waitUntil: 'networkidle2',
  timeout: 180000, // 3 min
}

const defaultNormalizeUrlOptions = {
  defaultProtocol: 'https:',
  stripHash: true,
  stripWWW: false,
}

const defaultSanitizeHtmlOptions = {
  allowedTags: false, // all
  allowedAttributes: false, // all
  selfClosing: [
    'img',
    'br',
    'hr',
    'area',
    'base',
    'basefont',
    'input',
    'link',
    'meta',
  ],
  allowedSchemes: ['http', 'https'], // no ftp, no mailto
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
  allowProtocolRelative: true,
  enforceHtmlBoundary: true,
}

const defaultDenyOrigins = [
  'quantserve',
  'adzerk',
  'doubleclick',
  'adition',
  'exelator',
  'sharethrough',
  'cdn.api.twitter',
  'google-analytics',
  'googletagmanager',
  'google',
  'fontawesome',
  'facebook',
  'twitter',
  'analytics',
  'optimizely',
  'clicktale',
  'mixpanel',
  'zedo',
  'clicksor',
  'tiqcdn',
]

const defaultDenyResources = [
  'image',
  'media',
  'font',
  'websocket',
  'manifest',
  'texttrack',
  'object',
  'beacon',
  'csp_report',
  'imageset',
]

module.exports = {
  port,
  host,
  defaultVMOptions,
  defaultBrowserLaunchOptions,
  defaultPageNavigationOptions,
  defaultNormalizeUrlOptions,
  defaultSanitizeHtmlOptions,
  defaultDenyOrigins,
  defaultDenyResources,
}
