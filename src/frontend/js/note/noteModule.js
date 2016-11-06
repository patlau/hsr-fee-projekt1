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
            this.createdDate = new Date(data.createdDate);
            this.finishedDate = (data.finishedDate ? Date(data.finishedDate) : null);
            this.dueDate = new Date(data.dueDate);
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
