'use strict';
/*global Handlebars, $ */
/*jshint unused:false*/

// Define noteModule in global

var NoteModule = function() {

    class Note {

        constructor(data = {}) {
            console.log('NOTE', JSON.stringify(this));
            this._id = data._id || data.id || 0;
            this.title = data.title || "Neue Notiz";
            this.description = data.description || "";
            this.importance = data.importance || 0;
            this.createdDate = (data.createdDate ? new Date(data.createdDate) : new Date());
            this.finishedDate = (data.finishedDate ? new Date(data.finishedDate) : null);
            this.dueDate = (data.dueDate ? new Date(data.dueDate) : new Date());
        }

        get id() {
            return this._id || 0;
        }

        set id(value) {
            this._id = value;
        }

        get done() {
            return this.finishedDate !== null;
        }

        set done(value) {
            if(value) {
                this.finishedDate = (new Date());
            } else {
                this.finishedDate = null;
            }
        }
    }

    return {
        Note: Note
    };

}();
