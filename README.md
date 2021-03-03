# PARSER

REST service to parse page by url and return normalized url and url key / html content / array of normalized filtered links

## Requests

All **GET** requests are health check requests with response `{ status: 'OK', code: 200 }`

All data requests are **POST** requests with `content-type: application/json`

**Url** and **links** are normalized using `https://github.com/sindresorhus/normalize-url`

Url's / link's **keys** are `sha256` `hex` digests

Example:

```http
POST http://localhost:8082
content-type: application/json

{
  "url": "github.com",
  "actions": ["getUrlKey", "getLinks", "getHtml"],
  "options": {
    "pageNavigation": {
      "waitUntil": "networkidle0",
      "timeout": 90000
    },
    "normalizeUrl": {
      "defaultProtocol": "https:",
      "stripHash": true
    }
  }
}
```

_url_ [**mandatory**] - url to any web page or s3 object

_actions_ - array of any available actions: `["getUrlKey", "getLinks", "getHtml"]`:

- _getUrlKey_ [**default**] - get normalized **url** and **key**, returns `url`, `key` in response
- _getHtml_ - get **html** content, returns `url`, `key`, `html` in response
- _getLinks_ - get array of normalized, filtered and sorted **links** (urls) with keys, returns `url`, `key`, `links` in response

_options_ - override default puppetier **page.goto** and/or **normalize-url** options:

- _pageGoto_ - [https://pptr.dev/#?product=Puppeteer&version=v5.2.1&show=api-pagegotourl-options](https://pptr.dev/#?product=Puppeteer&version=v5.2.1&show=api-pagegotourl-options)
- _normalizeUrl_ - [https://www.npmjs.com/package/normalize-url](https://www.npmjs.com/package/normalize-url)

default `pageNavigation` options:

```json
"options": {
  "pageNavigation": {
    "waitUntil": "domcontentloaded",
    "timeout": 90000
  }
}
```

default `normalizeUrl` options:

```json
"options": {
  "normalizeUrl": {
    "defaultProtocol": "https:",
    "normalizeProtocol": true,
    "removeTrailingSlash": true,
    "stripHash": true,
    "sortQueryParameters": true,
    "stripAuthentication": true,
    "stripWWW": false,
    "forceHttp": false,
    "forceHttps": false,
    "stripProtocol": false,
    "removeQueryParameters": [/^utm_\w+/i],
    "removeDirectoryIndex": false
  }
}
```

Minimal request with mandatory _url_ parameter:

```http
POST http://localhost:8082
content-type: application/json

{
    "url": "GitHub.com/#hash"
}
```

Response:

```http
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 163
ETag: W/"a3-u3ysdS1e7+w+ho4x+MwprnUN8JE"
Date: Fri, 14 Aug 2020 07:11:36 GMT
Connection: close

{
  "url": "https://github.com",
  "key": "996e1f714b08e971ec79e3bea686287e66441f043177999a13dbc546d8fe402a",
  "status": "OK",
  "code": 200,
  "request": {
    "url": "GitHub.com/#hash"
  }
}
```

### Request schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "#",
  "type": "object",
  "examples": [
    {
      "url": "github.com",
      "actions": ["getUrlKey", "getLinks", "getHtml"],
      "options": {
        "pageNavigation": {
          "waitUntil": "networkidle0",
          "timeout": 90000
        },
        "normalizeUrl": {
          "defaultProtocol": "https:",
          "stripHash": true
        }
      }
    }
  ],
  "required": ["url"],

  "properties": {
    "url": {
      "$id": "#/properties/url",
      "type": "string",
      "additionalProperties": true,
      "examples": ["github.com"]
    },
    "actions": {
      "$id": "#/properties/actions",
      "type": "array",
      "default": [],
      "examples": [["getUrlKey", "getLinks"]]
    },
    "options": {
      "$id": "#/properties/options",
      "type": "object",
      "examples": [
        {
          "pageNavigation": {
            "waitUntil": "networkidle0",
            "timeout": 90000
          },
          "normalizeUrl": {
            "defaultProtocol": "https:",
            "stripHash": true
          }
        }
      ],
      "properties": {
        "pageNavigation": {
          "$id": "#/properties/options/properties/pageNavigation",
          "type": "object"
        },
        "normalizeUrl": {
          "$id": "#/properties/options/properties/normalizeUrl",
          "type": "object"
        }
      }
    }
  }
}
```

### Response schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "http://example.com/example.json",
  "type": "object",
  "examples": [
    {
      "url": "https://github.com",
      "key": "996e1f714b08e971ec79e3bea686287e66441f043177999a13dbc546d8fe402a",
      "status": "OK",
      "code": 200,
      "html": "<!DOCTYPE html>",
      "links": [
        {
          "url": "https://github.blog",
          "key": "6033da28b4a37629587b09532db9d82184a2e7988265c316d00c40026d0e7bcb"
        }
      ],
      "request": {}
    }
  ],
  "properties": {
    "url": {
      "$id": "#/properties/url",
      "type": "string",
      "examples": ["https://github.com"]
    },
    "key": {
      "$id": "#/properties/key",
      "type": "string",
      "examples": [
        "996e1f714b08e971ec79e3bea686287e66441f043177999a13dbc546d8fe402a"
      ]
    },
    "status": {
      "$id": "#/properties/status",
      "type": "string",
      "examples": ["OK"]
    },
    "code": {
      "$id": "#/properties/code",
      "type": "integer",
      "examples": [200]
    },
    "html": {
      "$id": "#/properties/html",
      "type": "string",
      "examples": ["<!DOCTYPE html>"]
    },
    "links": {
      "$id": "#/properties/links",
      "type": "array",
      "examples": [
        [
          {
            "url": "https://github.blog",
            "key": "6033da28b4a37629587b09532db9d82184a2e7988265c316d00c40026d0e7bcb"
          }
        ]
      ],
      "items": {
        "$id": "#/properties/links/items",
        "anyOf": [
          {
            "$id": "#/properties/links/items/anyOf/0",
            "type": "object",
            "examples": [
              {
                "url": "https://github.blog",
                "key": "6033da28b4a37629587b09532db9d82184a2e7988265c316d00c40026d0e7bcb"
              }
            ],
            "properties": {
              "url": {
                "$id": "#/properties/links/items/anyOf/0/properties/url",
                "type": "string",
                "examples": ["https://github.blog"]
              },
              "key": {
                "$id": "#/properties/links/items/anyOf/0/properties/key",
                "type": "string",
                "examples": [
                  "6033da28b4a37629587b09532db9d82184a2e7988265c316d00c40026d0e7bcb"
                ]
              }
            }
          }
        ]
      }
    },
    "request": {
      "$id": "#/properties/request",
      "type": "object",
      "examples": [{}]
    }
  }
}
```
