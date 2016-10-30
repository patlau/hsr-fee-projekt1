'use strict';
/*global NoteModule*/
/*jshint unused:false*/
NoteModule.storageService = (function($){

    function ajax(metod, url, data, headers) {
        return $.ajax({
            dataType: "json",
            contentType: "application/json",
            headers: headers,
            method: metod,
            url: url,
            data: JSON.stringify(data)
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

    return {
        loadNotes: publicLoadNotes,
        saveNote: publicSaveNote,
        createNote: publicCreateNote,
    };

})(jQuery);
