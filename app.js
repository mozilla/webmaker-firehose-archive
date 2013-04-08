var express = require('express'),
    path = require('path');

var app = express();

app.use(express.logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000);