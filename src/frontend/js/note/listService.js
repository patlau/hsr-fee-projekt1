'use strict';
/*global Handlebars, $, NoteModule, storageModule */
/*jshint unused:false*/

NoteModule.listService = (function() {

    var listOptions = {
        sortOrder: 1, // Default Note sort order
        sortBy: 'createdDate', // Default Note sort by
        showFinished: 0 // Do not show done Notes by default
    };

    // Return copy of current list options
    function publicGetOptions() {
        return {
            sortOrder: listOptions.sortOrder,
            sortBy: listOptions.sortBy,
            showFinished: listOptions.showFinished
        };
    }

    var notes = []; // Filtered notes

    function publicToggleSortBy(prop) {
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

    // Load notes
    function publicLoadNotes(callback) {
        console.log('LoadNotes: ' + JSON.stringify(notes));
        if (!notes || notes.length === 0) {
            console.log('LOAD');
            NoteModule.storageService.loadNotes().then(
                function(data) {
                    for (let item of data) {
                        let note = new NoteModule.Note(item);
                        notes.push(note);
                    }
                    console.log(notes);
                    if(callback) callback();
                },
                function(err) {
                    console.log(err);
                });
        } else {
            if(callback) callback();
        }
    }

    function publicAddNote(callback) {
        let note = NoteModule.storageService.createNote().then(
            function(note) {
                notes.push(new NoteModule.Note(note));
                if(callback) callback();
            } ,
            function(err) {window.alert(err)});
    }

    function publicToggleShowFinished() {
        listOptions.showFinished = listOptions.showFinished === 1 ? 0 : 1;
    }

    function publicGetNotes() {
        console.log('GetNotes ' + JSON.stringify(listOptions));
        sortNotes();
        if(listOptions.showFinished) {
            return notes;
        } else {
            return notes.filter(each => !each.done);
        }
    }

    function publicGetNote(id) {
        return notes.find(each => each.id === id);
    }

    /*
     * TODO: If Storage Service fails, the done state on my cache is invalid
     */
    function publicSetDone(id, value, callback) {
        let note = publicGetNote(id);
        if(note) {
            note.done = value ? true : false;
            console.log("DONE: " + note.done + " FOR " + note.id);
            NoteModule.storageService.saveNote(note).then(
                function(note) {
                    if(callback) callback();
                } ,
                function(err) {window.alert(err)});
        }
    }

    return {
        loadNotes: publicLoadNotes,
        addNote: publicAddNote,
        toggleShowFinished: publicToggleShowFinished,
        getNotes: publicGetNotes,
        getNote: publicGetNote,
        toggleSortBy: publicToggleSortBy,
        setDone: publicSetDone,
        getOptions: publicGetOptions
    };

})();
