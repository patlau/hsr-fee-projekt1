'use strict';
/*global Handlebars, $, NoteModule, storageModule */
/*jshint unused:false*/

NoteModule.listService = (function() {

    var listOptions = {
        sortOrder: 1, // Default Note sort order
        sortBy: 'createdDate', // Default Note sort by
        showFinished: 0 // Do not show done Notes by default
    };

    var notes = []; // Filtered notes

    function toggleSortBy(prop) {
        if (listOptions.sortBy === prop) {
            listOptions.sortOrder = (listOptions.sortOrder === 1) ? 0 : 1;
        } else {
            listOptions.sortOrder = 1;
        }
        listOptions.sortBy = prop;
        sortNotes();
    }

    function sortNotes() {

        let prop = listOptions.sortBy || 'createdDate';
        let ascending = listOptions.sortOrder;

        console.log('SORTING ' + prop + ' => ' + ascending);

        notes = notes.sort(function(a, b) {
            if (ascending) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });
    }

    function privateLoadNotes() {
        if(listOptions.showFinished === 1) {
            return NoteModule.storageService.findAllNotes();
        } else {
            return NoteModule.storageService.findOpenNotes(true);
        }
    }

    // Load notes, convert to Note objects and apply filter and sort order
    function loadNotes() {
        notes = [];
        let data = privateLoadNotes();
        for (let item of data) {
            let note = new NoteModule.Note(item);
            notes.push(note);
        }
        sortNotes();
    }

    function addNote() {
        let note = NoteModule.storageService.createNote();
        notes.push(new NoteModule.Note(note));
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

    function getNote(id) {
        return notes.find(each => each.id === id);
    }

    function toggleDone(id) {
        let note = getNote(id);
        if(note) {
            note.done = note.done ? false : true;
            NoteModule.storageService.saveNote(note);
        }
    }

    return {
        loadNotes: loadNotes,
        addNote: addNote,
        getSortOrder: getSortOrder,
        toggleShowFinished: toggleShowFinished,
        getNotes: getNotes,
        getNote: getNote,
        sortNotes: sortNotes,
        toggleSortBy: toggleSortBy,
        toggleDone: toggleDone
    };

})();

