'use strict';
/*global NoteModule*/
/*jshint unused:false*/
NoteModule.storageService = (function(ajaxUtil){

    function publicLoadNotes() {
        return ajaxUtil.ajax("GET", "/notes/", {});
    }

    function publicSaveNote(note) {
        return ajaxUtil.ajax("PUT", "/notes/" + note.id, note);
    }

    function publicCreateNote() {
        return ajaxUtil.ajax("POST", "/notes/", note);
    }

    return {
        loadNotes: publicLoadNotes,
        saveNote: publicSaveNote,
        createNote: publicCreateNote,
    };

})(window.ajaxUtil);
