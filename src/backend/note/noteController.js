var store = require("./noteStore");
var events = require("../event").events;

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
        events.emit('note', {event: 'created', note: note});
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
        events.emit('note', {event: 'updated', note: note});
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
        events.emit('note', {event: 'deleted', note: note});
    });
};

module.exports.pollNote = function(req, res){
    events.once('note', function(note) {
        console.log('ONCE ' + note);
        res.format({
            'application/json': function () {
                res.json(note);
            }
        });
    });
};
