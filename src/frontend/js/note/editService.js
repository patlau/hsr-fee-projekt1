'use strict';
/*global Handlebars, $, storageModule, NoteModule */
/*jshint unused:false*/

NoteModule.editService = (function() {

    function saveNote(note) {
        NoteModule.storageService.saveNote(note);
    }

    return {
        saveNote: saveNote
    };
})();

