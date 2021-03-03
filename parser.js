require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const { port, host } = require('./config')
const { actionUrlKey, actionParseHtml } = require('./actions')
const { launchBrowser } = require('./render')

const app = express()
app.set('trust proxy', 1)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(`${process.cwd()}/rest-mocks`))

const sendMock = (res, fileName) =>
  res.sendFile(`${process.cwd()}/rest-mocks/${fileName}`)

// test pages with links (localhost only)
if (/localhost/.test(host)) {
  app.get('/icon.png', (req, res) => sendMock('icon.png'))
  app.get('/test', (req, res) => sendMock(res, 'test-links.html'))
  app.get('/inner', (req, res) => sendMock(res, 'inner-link.html'))
  app.get('/inner-click', (req, res) => sendMock(res, 'inner-link.html'))
}
app.get('/', (req, res) => res.status(200).send({ status: 'OK', code: 200 }))

app.post('/urlkey', actionUrlKey)
app.post('/parsehtml', actionParseHtml)

app.listen(port, async () => {
  try {
    await launchBrowser()
    console.log(`wi-parser listen on http://localhost:${port}`)
    console.log('---- V2 ----')
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
})
