var express = require('express');
var app = express();
var bodyParser = require('body-parser');

try {
    app.use(require('connect-livereload')());s
} catch(ex) {
    console.log('Livereload deactivated');
}

//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

app.use('/', express.static('frontend'));

app.get('/rest', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!!!' });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
