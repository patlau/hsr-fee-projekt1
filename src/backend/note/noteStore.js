var Datastore = require('nedb');
var db = new Datastore({ filename: './data/note.db', autoload: true });

function Note(data)
{
    this.title = data.title || "Neue Notiz";
    this.description = data.description || "";
    this.importance = data.importance || 0;
    this.createdDate = data.createdDate || (new Date());
    this.finishedDate = data.finishedDate || "";
    this.dueDate = data.dueDate || (new Date());
}

function publicAdd(data, callback)
{
    var note = new Note(data);
    db.insert(note, function(err, newDoc){
        if(callback){
            callback(err, newDoc);
        }
    });
}

function publicDelete(id, callback) {
    db.update({_id: id}, {$set: {"state": "DELETED"}}, {}, function (err, count) {
        publicGet(id, callback);
    });
}

function publicGet(id, callback)
{
    db.findOne({ _id: id}, function (err, doc) {
        callback( err, doc);
    });
}

function publicAll(callback)
{
    db.find({}, function (err, docs) {
        callback( err, docs);
    });
}

function publicUpdate(id, data, callback) {
    db.update({_id: id}, { $set: data }, {}, function (err, count) {
        publicGet(id, callback);
    });
}

module.exports = {add : publicAdd, delete : publicDelete, get : publicGet, all : publicAll, update: publicUpdate};
