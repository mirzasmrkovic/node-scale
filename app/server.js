const fs = require('fs')
const http = require('http')
const port = 3000

let writeToHead = (url, response) => {
  let extension = url.substring(url.lastIndexOf('.') + 1)
  let isInsideRoot = url.indexOf('/') < 0 ? true : false

  response.writeHead(200, {'Content-Type': `text/${extension}` })
  fs.readFile(`${(!isInsideRoot ? '.' : '') + url}`, null, (err, data) => {
    if(err) throw err
    response.write(data)
    response.end()
  })
}

const server = http.createServer((request, response) => {
  let url = request.url
  if(url !== '/') writeToHead(url, response)
  else writeToHead('index.html', response)
}).listen(port)
