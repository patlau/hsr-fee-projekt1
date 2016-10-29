'use strict';
/*global Handlebars, $, NoteModule, handlebarModule */
/*jshint unused:false*/

NoteModule.editPage = (function() {

    var note = null;

    function displayEditPage(aNote) {
        note = aNote;
        handlebarModule.loadTemplate("main", "edit-template", note);
        $("#cancel").on("click", function() {
           NoteModule.listPage.display();
        });
        $("#ok").on("click", function() {
            note.title = $("#title").val();
            note.description = $("#description").val();
            note.importance = $("#importance").val();
            note.dueDate = $("#dueDate").val();

            NoteModule.editService.saveNote(note);
            NoteModule.listPage.display();
        });
    }

    return {
        display: displayEditPage
    };

})();
