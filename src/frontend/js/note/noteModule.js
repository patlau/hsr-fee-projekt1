'use strict';
/*global Handlebars, $ */
/*jshint unused:false*/

// Define noteModule in global

var NoteModule = function() {

    Date.prototype.toDateISOString = function () {
        return this.toISOString().substr(0, 10);
    };

    class Note {

        constructor(data = {}) {
            this.id = data.id || 0;
            this.title = data.title || "Neue Notiz";
            this.description = data.description || "";
            this.importance = data.importance || 0;
            this.createdDate = data.createdDate || (new Date());
            this.finishedDate = data.finishedDate || "";
            this.dueDate = data.dueDate || (new Date());
        }

        get done() {
            return this.finishedDate !== null && this.finishedDate !== "";
        }

        set done(value) {
            if(value) {
                this.finishedDate = (new Date());
            } else {
                this.finishedDate = "";
            }
        }
    }

    return {
        Note: Note
    };

}();
