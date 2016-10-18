'use strict';
/*global Handlebars, $, storageModule */
/*jshint unused:false*/

var noteModule = (function() {

    var listOptions = {
        sortOrder: 1, // Default Note sort order
        sortBy: '', // Default Note sort by
        showFinished: 0 // Do not show done Notes by default
    };

    var allNotes = []; // All notes
    var notes = []; // Filtered notes

    class Note {

        constructor (data = {}) {
            this.id = data.id || 0;
            this.title = data.title || "Neue Notiz";
            this.description = data.description || "";
            this.importance = data.importance || 0;
            this.createdDate = data.createdDate || (new Date().toISOString());
            this.finishedDate = data.finishedDate || "";
        }

        get done() {
            return this.finishedDate !== null && this.finishedDate !== "";
        }
    }

    class NoteRepository {

    }

    function sortNotesBy(prop) {

        if (prop === undefined || prop === null || prop === '') {
            return sortNotesBy(listOptions.sortBy === '' ? 'createdDate': '');
        }

        if(listOptions.sortBy === prop) {
            listOptions.sortOrder = (listOptions.sortOrder === 1) ? 0 : 1;
        }
        notes = notes.sort(function(a, b) {
            if (listOptions.sortOrder) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        // Keep last sort property for refreshing list
        if(prop !== undefined) {
            listOptions.sortBy = prop;
        }
    }

    function filterNotes() {
        if(listOptions.showFinished === 1) {
            notes = allNotes;
        } else {
            notes = allNotes.filter( each => !each.done );
        }
    }

    // Load notes, convert to Note objects and apply filter and sort order
    function loadNotes() {
        let data = storageModule.loadNotes();
        for (let item of data) {
            let note = new Note(item);
            allNotes.push(note);
        }
        filterNotes();
        sortNotesBy(listOptions.sortBy);
    }

    function addNote() {
        let note = new Note({id: allNotes.length + 1});
        allNotes.push(note);
    }

    function getSortOrder() {
        return listOptions.sortOrder;
    }

    function toggleShowFinished() {
        listOptions.showFinished = listOptions.showFinished === 1 ? 0 : 1;
    }

    function getNotes() {
        return notes;
    }

    return {
        loadNotes: loadNotes,
        addNote: addNote,
        filterNotes: filterNotes,
        sortNotesBy: sortNotesBy,
        getSortOrder: getSortOrder,
        toggleShowFinished: toggleShowFinished,
        getNotes: getNotes
    };

})();

