var store = require("./noteStore");

module.exports.getNotes = function(req, res){
    store.all(function(err, notes) {
        res.format({
            'application/json': function () {
                res.json(notes);
            }
        });
    });
};

module.exports.getNote = function(req, res){
    store.get(req.data.id, function(err, note) {
        res.format({
            'application/json': function () {
                res.json(note);
            }
        });
    });
};

module.exports.createNote = function(req, res)
{
    console.log('ADD ' + JSON.stringify(req.body));
    store.add(req.body, function(err, note) {
        res.format({
            'application/json': function(){
                res.json(note);
            }
        });
    });
};

module.exports.updateNote =  function (req, res)
{
    console.log('UPDATE ' + req.params.id + ' => ' + JSON.stringify(req.body));
    store.update(req.params.id, req.body, function(err, note) {
        res.format({
            'application/json': function(){
                res.json(note);
            }
        });
    });
};

module.exports.deleteNote =  function (req, res)
{
    store.delete(  req.params.id, function(err, note) {
        res.format({
            'application/json': function(){
                res.json(note);
            }
        });
    });
};