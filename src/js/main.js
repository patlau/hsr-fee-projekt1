/*global Handlebars, $*/
/*exported onEditClicked*/
/*jshint unused:false*/

var mainModule = (function() {

    var templateCache = {};
    var selectedStyle = "blackwhite";

    var testNotes = [
        {
            "id": 1,
            "dueDate": "2016-09-25",
            "importance": 2,
            "description": `HTML für die note App erstellen.
CSS erstellen für die note App. 
Mehr erstellen für die note App`,
            "title": "CAS FEE Selbststudium / Projekt Aufgaben erledigen",
            "done": true,
            "createdDate": "2016-01-01",
            "finishedDate": "2016-05-01"
        },
        {
            "id": 2,
            "dueDate": "2016-09-19",
            "importance": 1,
            "description": `Butter
Eier
Mehl`,
            "title": "Einkaufen",
            "done": false,
            "createdDate": "2016-02-01",
            "finishedDate": null
        },
        {
            "id": 3,
            "dueDate": "2016-09-01",
            "importance": 0,
            "description": "999 99 99",
            "title": "Mami anrufen",
            "done": false,
            "createdDate": "2016-03-01",
            "finishedDate": null
        }
    ];

    var notes = [];

    function Note(id, title, description, importance, dueDate, done, createdDate, finishedDate) {
        this.id = id;
        this.description = description;
        this.importance = importance;
        this.dueDate = dueDate;
        this.done = done;
        this.createdDate = createdDate;
        this.finishedDate = finishedDate;
    }

    Note.prototype.dueDateLabel= function() {
        return this.dueDate;
    };

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
        if (template === undefined) {
            console.log("Compile template " + templateId);
            let source = $('#' + templateId).html();
            template = Handlebars.compile(source);
            templateCache[templateId] = template;
            Handlebars.registerPartial(templateId, template);
        }
        if (jQuerySelector !== "") {
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

    function initHandlebarHelpers() {
        Handlebars.registerHelper('importance_display', function (count) {
            let out = "";
            for (var i = 0; i < count; i++) {
                out = out + "<i class=\"fa fa-bolt\"></i>";
            }
            return new Handlebars.SafeString(out);
        });
        Handlebars.registerHelper('edit_button', function (id) {
            return new Handlebars.SafeString("<button name=\"edit" + id + "\" onclick=\"mainModule.onEditClicked(" + id + ")\">Edit</button>");
        });
    }

    function setStyle(newStyle) {
        $("button").each(function() {
            console.log($(this));
            console.log(" Remove: " + selectedStyle + " Add: " + newStyle);
            $(this).removeClass(selectedStyle);
            $(this).addClass(newStyle);
        });
        selectedStyle = newStyle;
    }

    function onEditClicked(id) {
        console.log(id);
    }

    function registerEventHandlers() {
        $( "#sortByFinishDate" ).on( "click", function() {
            console.log( "SortByFinishDate was clicked" );
        });
        $( "#sortByCreatedDate" ).on( "click", function() {
            console.log( "sortByCreatedDate was clicked" );
        });
        $( "#sortByImportance" ).on( "click", function() {
            console.log( "sortByImportance was clicked" );
        });
        $( "#newNote" ).on( "click", function() {
            console.log( "NewNote was clicked" );
        });
        $( "#showFinished" ).on( "click", function() {
            console.log( "ShowFinished was clicked" );
        });
        $( "#styleSelection" ).on( "change", function() {
            console.log( "styleSelection was changed" );
            console.log($(this).val());
            setStyle($(this).val());
        });
    }

    function initModule() {
        initHandlebarHelpers();
        loadNotes();
        loadTemplates();
        registerEventHandlers();
        setStyle("blackwhite");
    }

    return {
        initModule: initModule,
        onEditClicked: onEditClicked
    };

})();

$(document).ready(function () {
    console.log("Start Main Module");
    mainModule.initModule();
});

