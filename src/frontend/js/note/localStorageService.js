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

    function publicLoadNotes() {
        notes = JSON.parse(localStorage.getItem("notes"));
        if(notes === null) {
            notes = notesJson;
        }
        return new Promise(function(resolve, reject) {
            if (notes) {
                resolve(notes);
            } else {
                reject(Error("No notes loaded"));
            }
        });
    }

    function privateSaveNotes() {
        if(!notes) {
            return;
        }
        console.log(notes);
        let json = JSON.stringify(notes);
        console.log(json);
        localStorage.setItem("notes", json);
    }

    function privateSaveNote(note) {
        if(notes) {
            let idx = notes.findIndex(each => {return each.id === note.id});
            if(idx) {
                notes[idx] = note;
            }
            privateSaveNotes();
        }
        return note;
    }

    function publicSaveNote(note) {
        let savedNote = privateSaveNote(note);
        return new Promise(function(resolve, reject) {
            if (savedNote.id) {
                resolve(savedNote);
            } else {
                reject(Error("Note not saved"));
            }
        });
    }

    function publicCreateNote() {
        let note = null;
        if(notes) {
            note = {id: notes.length + 1};
            notes.push(note);
            note = privateSaveNote(note);
        }
        return new Promise(function(resolve, reject) {
            if (note.id) {
                resolve(note);
            } else {
                reject(Error("Note not created"));
            }
        });
    }

    return {
        loadNotes: publicLoadNotes,
        saveNote: publicSaveNote,
        createNote: publicCreateNote,
    };

})();
