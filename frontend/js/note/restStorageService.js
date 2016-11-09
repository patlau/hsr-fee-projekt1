'use strict';
/*global NoteModule*/
/*jshint unused:false*/
NoteModule.storageService = (function($){

    function ajax(method, url, data, timeout) {
        return $.ajax(url, {
            dataType: "json",
            contentType: "application/json",
            method: method,
            data: (data ? JSON.stringify(data) : null),
            timeout: timeout || 5000
        });
    }

    function publicLoadNotes() {
        console.log('REST>>GET');
        return ajax("GET", "/notes");
    }

    function publicSaveNote(note) {
        if(note.id) {
            return updateNote(note);
        } else {
            return createNote(note);
        }
    }

    function updateNote(note) {
        console.log('REST>>PUT ' + JSON.stringify(note));
        return ajax("PUT", "/notes/" + note.id, note);
    }

    function createNote(note) {
        console.log('REST>>POST ' + JSON.stringify(note));
        return ajax("POST", "/notes", note);
    }

    function publicPollNote() {
        console.log('REST>>POLL');
        return ajax('GET', '/notes/poll', null, 60000);
    }

    function publicDeleteNote(note) {
        return ajax("DELETE", "/notes/" + note.id);
    }

    return {
        loadNotes: publicLoadNotes,
        saveNote: publicSaveNote,
        pollNote: publicPollNote,
        deleteNote: publicDeleteNote
    };

})(jQuery);
