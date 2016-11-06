'use strict';
/*global Handlebars, $, StyleModule, handlebarModule, NoteModule */
/*jshint unused:false*/

NoteModule.listController = (function($, handlebarModule, styleModule) {

    function updateListTemplate() {

        if(!$('#list')) {
            return;
        }
        let notes = NoteModule.listService.getNotes();
        handlebarModule.loadTemplate("#list", "list-template", {"notes": notes});

        $('#list').on('click', '.edit', function() {
            let noteId = $(this).closest("tr").data().noteId;
            let note = NoteModule.listService.getNote(noteId);
            NoteModule.editController.display(note);
        });
        $('#list').on('click', '.delete', function() {
            let noteId = $(this).closest("tr").data().noteId;
            let note = NoteModule.listService.deleteNote(noteId, updateListTemplate);
        });

        $('#list').on('click', 'input[type=checkbox]', function() {
            console.log('clicked', $(this));
            let noteId = $(this).closest("tr").data().noteId;
            let checked = $(this).is(':checked');
            NoteModule.listService.setDone(noteId, checked);
            if(checked)
                setTimeout(updateListTemplate, 100);
        });
        NoteModule.listService.pollNote(updateListTemplate);
    }

    function displayListView() {

        // Load and display templates
        handlebarModule.loadTemplate("", "list-entry-template", {});
        handlebarModule.loadTemplate("main", "master-template", {});

        // Register event handlers
        $( ".sortButton" ).on( "click", function() {

            let sortBy = $(this).data().sortBy;

            NoteModule.listService.toggleSortBy(sortBy);
            updateListTemplate();

            setSortIcon(NoteModule.listService.getOptions());

            // Show or hide sort icon
            $('.sortButton > i').addClass('hidden');
            $(this).find('i').toggleClass('hidden');

        });
        $( "#newNote" ).on( "click", function() {
            NoteModule.listService.addNote(function() {
                updateListTemplate();
            });
        });
        $( "#showFinished" ).on( "click", function() {
            NoteModule.listService.toggleShowFinished();
            $(this).toggleClass("down");
            updateListTemplate();
        });
        $( "#styleSelection" ).on( "change", function() {
            //console.log( "styleSelection was changed" );
            styleModule.applyStyle($(this).val());
        });

        // Initial view states
        let options = NoteModule.listService.getOptions();
        if(options.showFinished) {
            $('#showFinished').addClass('down');
        } else {
            $('#showFinished').removeClass('down');
        }
        setSortIcon(options);

        // Initial load of all notes
        NoteModule.listService.loadNotes(updateListTemplate);

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

})(jQuery, handlebarModule, StyleModule);
