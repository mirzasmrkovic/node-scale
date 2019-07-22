const fs = require('fs')
const http = require('http')
const port = 3000
// const styles = require('styles.css')

let writeToHeader = (response, data) => {
  response.write(data)
  response.end()
}

const server = http.createServer((request, response) => {
  switch (request.url) {
    case '/css/styles.css' :
      response.writeHead(200, {'Content-Type': 'text/css'})
      fs.readFile('css/styles.css', null, (err, data) => writeToHeader(response, data))
      break
    case '/' :
      response.writeHead(200, {'Content-Type': 'text/html'})
      fs.readFile('index.html', null, (err, data) => writeToHeader(response, data))
      break
    case '/app.js' :
      response.writeHead(200, {'Content-Type': 'text/js'})
      fs.readFile('app.js', null, (err, data) => writeToHeader(response, data))
      break
    case '/favicon.ico' :
      response.writeHead(200, {'Content-Type': 'text/icon'})
      fs.readFile('app.js', null, (err, data) => writeToHeader(response, data))
    }


}).listen(port)
