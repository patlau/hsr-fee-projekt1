'use strict';
/*global Handlebars, $, NoteModule, handlebarModule */
/*jshint unused:false*/

NoteModule.editController = (function() {

    var note = null;

    function displayEditView(aNote) {
        note = aNote;
        handlebarModule.loadTemplate("main", "edit-template", note);
        $("#cancel").on("click", function() {
           NoteModule.listController.display();
        });
        $("#ok").on("click", function() {
            note.title = $("#title").val();
            note.description = $("#description").val();
            note.importance = $("#importance").val();
            note.dueDate = $("#dueDate").val();

            NoteModule.editService.saveNote(note);
            NoteModule.listController.display();
        });
    }

    return {
        display: displayEditView
    };

})();
