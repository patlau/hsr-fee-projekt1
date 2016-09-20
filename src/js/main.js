/* global Handlebars, $ */

(function() {

    var templateCache = {};

    var testNotes = [
        {
            "id": 1,
            "due": "2016-09-25",
            "importance": 2,
            "description": `HTML für die note App erstellen.
CSS erstellen für die note App. 
Mehr erstellen für die note App`,
            "title": "CAS FEE Selbststudium / Projekt Aufgaben erledigen",
            "done": true
        },
        {
            "id": 2,
            "due": "2016-09-19",
            "importance": 1,
            "description": `Butter
Eier
Mehl`,
            "title": "Einkaufen",
            "done": false
        },
        {
            "id": 3,
            "due": "2016-09-01",
            "importance": 0,
            "description": "999 99 99",
            "title": "Mami anrufen",
            "done": false
        }
    ];

    var notes = [];

    function Note(id, title, description, importance, due, done) {
        this.id = id;
        this.description = description;
        this.importance = importance;
        this.due = due;
        this.done = done;
    }

    function getAbout() {
        return {
            project: 'HSR FEE Projekt 1',
            student: 'Patrick Lauper'
        };
    }

    /*
     * Load Handlebars template and update DOM if a selector is given.
     * Each template is also registered as partial, so it can
     * be reused.
     */
    function loadTemplate(jQuerySelector, templateId, context) {
        let template = templateCache[templateId];
        if(template === undefined) {
            console.log("Compile template " + templateId);
            let source = $('#' + templateId).html();
            template = Handlebars.compile(source);
            templateCache[templateId] = template;
            Handlebars.registerPartial(templateId, template);
        }
        if(jQuerySelector !== "") {
            console.log("Updating template " + templateId);
            var html = template(context);
            $(jQuerySelector).html(html);
        }
    }

    function loadTemplates() {
        loadTemplate("", "list-entry-template", {});
        loadTemplate("main", "master-template", {"notes": notes});
        loadTemplate(".app-footer", "app-footer-template", getAbout());
    }

    function loadNotes() {
        let data = testNotes;
        for (let item of data) {
            let note = $.extend(new Note(), item);
            notes.push(note);
        }
    }

    $(document).ready(function () {
        loadNotes();
        loadTemplates();
    });

})();

