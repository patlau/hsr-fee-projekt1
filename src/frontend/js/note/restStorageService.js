'use strict';
/*global NoteModule*/
/*jshint unused:false*/
NoteModule.storageService = (function($){

    function ajax(method, url, data, timeout) {
        return $.ajax({
            dataType: "json",
            contentType: "application/json",
            method: method,
            url: url,
            data: JSON.stringify(data),
            timeout: timeout || 5000
        });
    }

    function publicLoadNotes() {
        console.log('REST>>GET');
        return ajax("GET", "/notes/", {});
    }

    function publicSaveNote(note) {
        console.log('REST>>PUT ' + JSON.stringify(note));
        return ajax("PUT", "/notes/" + note.id, note);
    }

    function publicCreateNote() {
        let note = {};
        console.log('REST>>POST ' + JSON.stringify(note));
        return ajax("POST", "/notes/", note);
    }

    function publicPollNote() {
        console.log('REST>>POLL');
        return ajax('GET', '/notes/poll', {}, 60000);
    }

    function publicDeleteNote(note) {
        return ajax("DELETE", "/notes/" + note.id);
    }

    return {
        loadNotes: publicLoadNotes,
        saveNote: publicSaveNote,
        createNote: publicCreateNote,
        pollNote: publicPollNote,
        deleteNote: publicDeleteNote
    };

})(jQuery);
