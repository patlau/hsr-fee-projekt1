'use strict';
/*global Handlebars, $, StyleModule, handlebarModule, NoteModule */
/*jshint unused:false*/

NoteModule.listPage = (function() {

    var listService = NoteModule.listService;

    function updateListTemplate() {
        handlebarModule.loadTemplate("#list", "list-template", {"notes": listService.getNotes()});
    }

    function refreshList() {
        listService.loadNotes();
        updateListTemplate();
    }

    function displayListPage() {

        listService.loadNotes();

        handlebarModule.loadTemplate("", "list-entry-template", {});
        handlebarModule.loadTemplate("main", "master-template", {});

        updateListTemplate();

        $( ".sortButton" ).on( "click", function() {

            let sortBy = $(this).data().sortBy;

            listService.toggleSortBy(sortBy);
            updateListTemplate();

            console.log("SORT: " + sortBy + " " + listService.getSortOrder());

            // Update sort icon
            $(this).find('i').toggleClass('fa-sort-asc', listService.getSortOrder() === 1);
            $(this).find('i').toggleClass('fa-sort-desc', listService.getSortOrder() === 0);

            // Show or hide sort icon
            $('.sortButton > i').addClass('hidden');
            $(this).find('i').toggleClass('hidden');

        });
        $( "#newNote" ).on( "click", function() {
            listService.addNote();
            refreshList();
        });
        $( "#showFinished" ).on( "click", function() {
            listService.toggleShowFinished();
            $(this).toggleClass("down");
            refreshList();
        });
        $( "#styleSelection" ).on( "change", function() {
            //console.log( "styleSelection was changed" );
            StyleModule.applyStyle($(this).val());
        });
        // Register event handler must be called always after setting list
        $('#list').on('click', '.edit', function() {
            let noteId = $(this).closest("tr").data().noteId;
            console.log("Edit: " + noteId);
            let note = listService.getNote(noteId);
            NoteModule.editPage.display(note);
        });
    }

    return {
        display: displayListPage
    };

})();
