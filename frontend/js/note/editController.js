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
            console.log($("#due"), $("#due").val());
            note.dueDate = $("#due").val();

            NoteModule.editService.saveNote(note, function() {
                NoteModule.listController.display();
            });
        });
    }

    return {
        display: displayEditView
    };

})();
