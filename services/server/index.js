// initialize dependencies
var express = require('express');
var bodyParser = require('body-parser');
var http = require("http");
const fs = require('fs');
var spawn = require('child_process').spawn;
const ffmpeg = require('fluent-ffmpeg')

var app  = express();
var portNumber = process.env.PORT || 9000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set("port", portNumber);

// url routing
app.get('/video/:file', function(req, res) {
  const { file } = req.params
	const path = `videos/${file}`
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

// start server
var server = http.createServer(app).listen(app.get('port'), function(req, res){
    console.log("Express server listening on port " + app.get('port'));
});
