'use strict';
/*global storageModule*/
/*jshint unused:false*/

var storageModule = (function(){
    /* This will later be loaded from storage */
    var notesJson = [
        {
            "id": 1,
            "importance": 2,
            "description": `HTML für die note App erstellen.
CSS erstellen für die note App. 
Mehr erstellen für die note App`,
            "title": "CAS FEE Selbststudium / Projekt Aufgaben erledigen",
            "done": 1,
            "createdDate": "2016-01-01",
            "finishedDate": "2016-05-01"
        },
        {
            "id": 2,
            "importance": 1,
            "description": `Butter
Eier
Mehl`,
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

    return {
        loadNotes: function() {
            let notes = JSON.parse(localStorage.getItem("notes"));
            if(notes === null) {
                notes = notesJson;
            }
            console.log(notes);
            return notes;
        },
        saveNotes: function(notes) {
            localStorage.setItem("notes", notes);
        }
    };

})();
