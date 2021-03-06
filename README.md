# API for fibi intern hiring chalenge

### Note: Please check out the [dev](https://github.com/sarbikbetal/fibi/tree/dev) branch for a better implementation.

#### This API is hosted on heroku at :
Base URL: `https://srbk-fibi.herokuapp.com/`


#### If you want to run the server locally, make to sure to have node.js installed

+ rename `sample-env` to `.env` and fill in the the Database URI

```bash
$ npm install
$ npm start
```

You will get the following output if everything is okay
```bash
> fibi@1.0.0 start /mnt/code/Node/fibi
> node app.js

Server running at port: 5400
Connected to MongoDB
```

Localhost Base URL: `localhost:5400`
## Reference
### Image object
```js
{
  "_id": "ObjectID",
  "url": "url",
  "name": "filename",
  "type": "mime type",
  "metaData": {
    "size": "bytes",
    "extType": "extension",
    "mime": "extracted mime"
}
```

## Routes

### Add Image

+ POST `{basUrl}/addImage`

Send a json body with header `Content-Type` as `application/json`

> Request Schema
```javascript
{
	"url": String (url),
	"name": String (file name),
	"type": String (mime type)
}
```

> Response
```json
// On success - Returns Image Object
{
  "_id": "5ef2276ea58578001714ca45",
  "url": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.MPU123oNkP4wjscYp4aO_AHaKd%26pid%3DApi&f=1",
  "name": "man.jpg",
  "type": "image/jpeg",
  "metaData": {
    "size": 28670,
    "extType": "jpg",
    "mime": "image/jpeg"
  }
}

// On error
{
  "errors": [
    {
      "msg": "Please set the Content-Type header to application/json",
      "param": "content-type",
      "location": "headers"
    },
    {
      "msg": "Invalid or empty mime type",
      "param": "type",
      "location": "body"
    }
  ]
}
```

> Example Request Body

```json
{
	"url": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.MPU123oNkP4wjscYp4aO_AHaKd%26pid%3DApi&f=1",
	"name": "man.jpg",
	"type": "image/jpg"
}
```

### Get Images

+ GET `{baseUrl}/getImages`

Send these options as query parameters
> Request Query
```js
{
   "nameString": String // name of the image to search
   "offset": Number (optional, default 0),// Offset the search query by this number
   "limit": Number (optional, default 10) // Max no of results per query
}

```
> Example query

`https://srbk-fibi.herokuapp.com/getImages?nameString=man&offset=7`

> Response

Retuns an array of Image Objects or an empty array
```json
[
  {
    "_id": "5ef2276ea58578001714ca45",
    "url": "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.MPU123oNkP4wjscYp4aO_AHaKd%26pid%3DApi&f=1",
    "name": "man.jpg",
    "type": "image/jpeg",
    "metaData": {
      "size": 28670,
      "extType": "jpg",
      "mime": "image/jpeg"
    }
  }
]
```
