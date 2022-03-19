var http = require('http')
var fs = require('fs')
var url = require('url')
var server = http.createServer(handleRequest)

function handleRequest(req, res) {
  if (req.method === 'GET' && req.url === '/') {
    fs.createReadStream('./index.html').pipe(res)
  } else if (req.method === 'GET' && req.url === '/about') {
    fs.createReadStream('./about.html').pipe(res)
  } else if (req.url.split('.').pop() === 'png') {
    res.setHeader('Content-Type', 'image/png')
    fs.createReadStream('./' + req.url).pipe(res)
  } else if (req.method === 'GET' && req.url === '/contact') {
    res.setHeader('Content-Type', 'text/html')
    fs.readFile('./contacts/suraj.json', (err, content) => {
      if (err) console.log(err)
      let parseData = JSON.parse(content)
      res.write(`<h1>${parseData.username}</h1>`)
      res.write(`<h2>Name: ${parseData.name}</h2>`)
      res.write(`<h3>Email: ${parseData.email}</h3>`)
      res.write(`<h4>Age: ${parseData.age}</h4>`)
      res.write(`<p>Bio: ${parseData.about}</p>`)
      res.end()
    })
  }
  var userDir = __dirname + '/contacts/'
  var store = ''
  var parsedUrl = url.parse(req.url, true)
  req.on('data', (chunk) => {
    store += chunk
  })
  req.on('end', () => {
    if (req.method === 'POST' && req.url === '/form') {
      let username = JSON.parse(store).username
      fs.open(userDir + username + '.json', 'wx', (err, fd) => {
        if (err) console.log(err)
        fs.writeFile(fd, store, (err) => {
          if (err) console.log(err)
          fs.close(fd, (err) => {
            if (err) console.log(err)
            res.end(`${username} successfully created`)
          })
        })
      })
    } else if (req.method === 'GET' && parsedUrl.pathname === '/users') {
      fs.readFile(
        userDir + parsedUrl.query.username + '.json',
        (err, content) => {
          if (err) console.log(content)
          res.setHeader('Content-Type', 'text/html')
          let parseData = JSON.parse(content)
          res.write(`<h1>${parseData.username}</h1>`)
          res.write(`<h2>Name: ${parseData.name}</h2>`)
          res.write(`<h3>Email: ${parseData.email}</h3>`)
          res.write(`<h4>Age: ${parseData.age}</h4>`)
          res.write(`<p>Bio: ${parseData.about}</p>`)
          res.end()
        },
      )
    }
  })
}

server.listen(5000, () => {
  console.log('server listening on port 5k')
})
