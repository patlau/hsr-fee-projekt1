/**
 * Long polling using an observer pattern.
 */

var EventEmitter = require('events').EventEmitter;
module.exports.events = new EventEmitter();
