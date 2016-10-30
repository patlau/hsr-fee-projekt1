'use strict';
/*global Handlebars, $, StyleModule, handlebarModule, NoteModule */
/*jshint unused:false*/

NoteModule.listController = (function(listService, $) {

    function updateListTemplate() {
        handlebarModule.loadTemplate("#list", "list-template", {"notes": listService.getNotes()});
    }

    function refreshList() {
        updateListTemplate();
    }

    function displayListView() {

        // Initial load of all notes
        listService.loadNotes();

        // Load and display templates
        handlebarModule.loadTemplate("", "list-entry-template", {});
        handlebarModule.loadTemplate("main", "master-template", {});
        updateListTemplate();

        // Register event handlers
        $( ".sortButton" ).on( "click", function() {

            let sortBy = $(this).data().sortBy;

            listService.toggleSortBy(sortBy);
            updateListTemplate();

            setSortIcon(listService.getOptions());

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
            NoteModule.editController.display(note);
        });
        $('#list').on('click', 'input[type=checkbox]', function() {
            let noteId = $(this).closest("tr").data().noteId;
            console.log("Done: " + noteId);
            listService.toggleDone(noteId);
        });

        // Initial view states
        let options = listService.getOptions();
        if(options.showFinished) {
            $('#showFinished').addClass('down');
        } else {
            $('#showFinished').removeClass('down');
        }
        setSortIcon(options);
    }

    function setSortIcon(options) {
        // Disable icon on all sort buttons
        $('.sortButton i').addClass('hidden');

        // Find button for current sort order
        let button = $('button[data-sort-by=' + options.sortBy + ']');

        // Show sort icon for button
        let icon = button.find('i');
        icon.toggleClass('fa-sort-asc', options.sortOrder === 1);
        icon.toggleClass('fa-sort-desc', options.sortOrder === 0);
        icon.removeClass('hidden');
    }

    return {
        display: displayListView
    };

})(NoteModule.listService, jQuery);
