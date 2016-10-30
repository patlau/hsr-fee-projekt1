var express = require('express');
var bodyParser = require('body-parser');

var app = express();

try {
    app.use(require('connect-livereload')());
} catch(ex) {
    console.log('Livereload deactivated');
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("method-override")(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

//app.use("/", require('./backend/indexRoutes.js'));
app.use("/", express.static(__dirname + '/frontend'));
app.use("/notes", require('./backend/note/noteRoutes.js'));
app.use(function(req, res) {
    res.status(404).end('error');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
