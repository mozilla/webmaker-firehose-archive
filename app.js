var express = require('express'),
    path = require('path');

var app = express();

app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render('index', {});
});

app.listen(process.env.PORT || 3000);