'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var requireDir = require('require-dir');
var port = 3015;
var app = express();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
  next();
});

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/models', express.static('models'));
app.get('/', function(req, res, next){
  res.render('index.html', {title: 'Time Passer'});
});

app.get('*', function(req, res, next){
  res
    .status(404)
    .end(JSON.stringify({error:'Page not found.'}));
});

app.listen(port, function(){
  console.log('Running on port: ' + port);
});
module.exports = app;