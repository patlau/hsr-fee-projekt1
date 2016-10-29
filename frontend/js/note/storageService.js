'use strict';
/*global NoteModule*/
/*jshint unused:false*/

NoteModule.storageService = (function(){
    /* This will later be loaded from storage */
    var notesJson = [
        {
            "id": 1,
            "importance": 2,
            "description": "HTML für die note App erstellen.\nCSS erstellen für die note App.\nMehr erstellen für die note App",
            "title": "CAS FEE Selbststudium / Projekt Aufgaben erledigen",
            "done": 1,
            "createdDate": "2016-01-01",
            "finishedDate": "2016-05-01"
        },
        {
            "id": 2,
            "importance": 1,
            "description": "Butter\nMilch\nMehl",
            "title": "Einkaufen",
            "done": 0,
            "createdDate": "2016-02-01",
            "finishedDate": ""
        },
        {
            "id": 3,
            "importance": 0,
            "description": "999 99 99",
            "title": "Mami anrufen",
            "done": 0,
            "createdDate": "2016-03-01",
            "finishedDate": ""
        }
    ];

    var notes = null;

    function loadNotes() {
        notes = JSON.parse(localStorage.getItem("notes"));
        if(notes === null) {
            notes = notesJson;
        }
        console.log(notes);
        return notes;
    }

    function saveNotes() {
        if(!notes) {
            return;
        }
        console.log(notes);
        let json = JSON.stringify(notes);
        console.log(json);
        localStorage.setItem("notes", json);
    }

    function openNotes() {
        if(!notes) {
            loadNotes();
        }
        return notes.filter( each => !each.done );
    }

    function saveNote(note) {
        if(!notes)
            return;
        let idx = notes.findIndex(each => {return each.id === note.id});
        if(idx) {
            notes[idx] = note;
        }
        saveNotes();
    }

    function createNote() {
        let note = {id: notes.length + 1};
        notes.push(note);
        saveNote(note);
        return note;
    }

    return {
        allNotes: loadNotes,
        openNotes: openNotes,
        saveNote: saveNote,
        createNote: createNote,
    };

})();
