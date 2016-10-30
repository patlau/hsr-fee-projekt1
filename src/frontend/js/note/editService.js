'use strict';
/*global Handlebars, $, storageModule, NoteModule */
/*jshint unused:false*/

NoteModule.editService = (function() {

    function saveNote(note, callback) {
        NoteModule.storageService.saveNote(note).then(callback(), function(err) {window.alert(err)});
    }

    return {
        saveNote: saveNote
    };
})();

