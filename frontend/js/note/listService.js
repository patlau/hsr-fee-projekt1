'use strict';
/*global Handlebars, $, NoteModule, storageModule */
/*jshint unused:false*/

NoteModule.listService = (function($, storageService) {

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

    var notes = [];

    function noteFactory(data) {
        return new NoteModule.Note(data);
    }

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

        //console.log('SORTING ' + prop + ' => ' + ascending);
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
        notes = [];
        if (!notes || notes.length === 0) {
            storageService.loadNotes().then(
                function(data) {
                    console.log('***LOAD', data);
                    let newNotes = [];
                    data.forEach(each => newNotes.push(noteFactory(each)));
                    notes = newNotes;
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

    function publicToggleShowFinished() {
        listOptions.showFinished = listOptions.showFinished === 1 ? 0 : 1;
    }

    function publicGetNotes() {
        console.log('GetNotes', listOptions, notes);
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
            storageService.saveNote(note).then(
                function(note) {
                    if(callback) callback();
                } ,
                function(err) {window.alert(err)});
        }
    }

    function eventHandler(event, noteData, callback) {
        console.log('EVENT', event, noteData);
        let note = noteFactory(noteData);
        let note2 = notes.find(each => each.id === note.id);
        if(event === 'created' && !note2) {
            notes.push(note);
            if(callback) callback();
        }
        if(event === 'deleted' && note2) {
            notes = notes.filter(each => each !== note2);
            if(callback) callback();
        }
        if(event === 'updated' && note2) {
            let idx = notes.findIndex(each => each.id === note.id);
            notes[idx] = note;
            if(callback) callback();
        }
    }

    var poll = false;
    function publicPollNote(callback) {
        console.log('POLL', poll);
        if(poll) return; // Allow only one polling request
        poll = true;
        storageService.pollNote().then(
            function(data) {
                console.log('EVENT', data);
                if(data.event && data.note) {
                    eventHandler(data.event, data.note, callback);
                }
                poll = false;
                publicPollNote(callback);
            },
            function(err) {
                console.log('EVENT-ERROR', err);
                poll = false;
                if(err.status === 0 && err.statusText === 'timeout') {
                    publicPollNote(callback);
                }
            });
    }

    function publicDeleteNote(id, callback) {
        let note = publicGetNote(id);
        storageService.deleteNote(note).then(
            function() {
                notes = notes.filter(each => each.id !== note.id);
                console.log("***DELETE", note, notes);
                if(callback) callback();
            },
            function(err) {console.log(err); }
        )
    }

    function publicNewNote() {
        let note = noteFactory({});
        return note;
    }

    return {
        newNote: publicNewNote,
        loadNotes: publicLoadNotes,
        toggleShowFinished: publicToggleShowFinished,
        getNotes: publicGetNotes,
        getNote: publicGetNote,
        toggleSortBy: publicToggleSortBy,
        setDone: publicSetDone,
        getOptions: publicGetOptions,
        pollNote: publicPollNote,
        deleteNote: publicDeleteNote
    };

})(jQuery, NoteModule.storageService);

