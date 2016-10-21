'use strict';
/*global Handlebars, $, aboutModule, storageModule, noteModule, handlebarModule */
/*jshint unused:false*/

var mainModule = (function() {

    /* ==========================================================================
     Variables
     ========================================================================== */

    var selectedStyle = "blackwhite"; // Default style


    /* ==========================================================================
     Styling
     ========================================================================== */

    function setStyle(newStyle) {
        /*$("button").each(function() {
            //console.log($(this));
            //console.log(" Remove: " + selectedStyle + " Add: " + newStyle);
            $(this).removeClass(selectedStyle);
            $(this).addClass(newStyle);
        });
        */
        $("body")
            .removeClass(selectedStyle)
            .addClass(newStyle);

        selectedStyle = newStyle;
    }

    /* ==========================================================================
     Events
     ========================================================================== */

    function updateListTemplate() {
        handlebarModule.loadTemplate("#list", "list-template", {"notes": noteModule.getNotes()});
    }


    function refreshList() {
        noteModule.filterNotes();
        noteModule.sortNotes();
        updateListTemplate();
    }

    function registerEventHandlers() {
        $( ".sortButton" ).on( "click", function() {

            let sortBy = $(this).data().sortBy;

            noteModule.sortNotesBy(sortBy);
            updateListTemplate();

            console.log("SORT: " + sortBy + " " + noteModule.getSortOrder());

            // Update sort icon
            $(this).find('i').toggleClass('fa-sort-asc', noteModule.getSortOrder() === 1);
            $(this).find('i').toggleClass('fa-sort-desc', noteModule.getSortOrder() === 0);

            // Show or hide sort icon
            $('.sortButton > i').addClass('hidden');
            $(this).find('i').toggleClass('hidden');

        });
        $( "#newNote" ).on( "click", function() {
            noteModule.addNote();
            refreshList();
        });
        $( "#showFinished" ).on( "click", function() {
            noteModule.toggleShowFinished();
            $(this).toggleClass("down");
            refreshList();
        });
        $( "#styleSelection" ).on( "change", function() {
            //console.log( "styleSelection was changed" );
            setStyle($(this).val());
        });
        // Register event handler must be called always after setting list
        $('#list').on('click', '.edit', function() {
            let noteId = $(this).closest(".list-row-container").data().noteId;
            console.log("Edit: " + noteId);
            let note = noteModule.getNote(noteId);
            console.log(note);
            handlebarModule.loadTemplate("main", "edit-template", note);
        });
    }

    /* ==========================================================================
     Templates
     ========================================================================== */
    function loadTemplates() {
        handlebarModule.loadTemplate("", "list-entry-template", {});
        handlebarModule.loadTemplate("main", "master-template", {});
        handlebarModule.loadTemplate("footer", "app-footer-template", aboutModule.about);
        updateListTemplate();
    }

    /* ==========================================================================
     Module initializing
     ========================================================================== */

    function initModule() {
        noteModule.loadNotes();
        handlebarModule.initHandlebars();
        loadTemplates();
        registerEventHandlers();
        setStyle("blackwhite");
    }

    return {
        initModule: initModule
    };

})();

$(document).ready(function () {
    console.log("Start Main Module");
    mainModule.initModule();
});
