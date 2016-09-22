/*global Handlebars, $*/
/*exported onEditClicked*/
/*jshint unused:false*/

var mainModule = (function() {

    var templateCache = {};
    var selectedStyle = "blackwhite";
    var sortOrder = 1;
    var sortBy = null;

    var testNotes = [
        {
            "id": 1,
            "dueDate": "2016-09-25",
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
            "dueDate": "2016-09-19",
            "importance": 1,
            "description": `Butter
Eier
Mehl`,
            "title": "Einkaufen",
            "done": 0,
            "createdDate": "2016-02-01",
            "finishedDate": null
        },
        {
            "id": 3,
            "dueDate": "2016-09-01",
            "importance": 0,
            "description": "999 99 99",
            "title": "Mami anrufen",
            "done": 0,
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

    Note.prototype.dueDateLabel = function() {
        return this.dueDate;
    };

    Note.prototype.finishedDateLabel = function() {
        if(this.finishedDate === null) {
            return '';
        } else {
            return '[' + this.finishedDate + ']';
        }
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

    function sortNotesBy(prop) {

        // Not perfect but does work sometimes...
        if(sortBy === prop) {
            if(sortOrder === 1) {
                sortOrder = 0;
            } else {
                sortOrder = 1;
            }
        }

        notes = notes.sort(function(a, b) {
            if (sortOrder) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        sortBy = prop;
    }

    function loadTemplates() {
        loadTemplate("", "list-entry-template", {});
        loadTemplate("main", "master-template", {});
        loadTemplate("#list", "list-template", {"notes": notes});
        loadTemplate("footer", "app-footer-template", getAbout());
    }

    function loadNotes() {
        let data = testNotes;
        for (let item of data) {
            let note = $.extend(new Note(), item);
            notes.push(note);
        }
        sortNotesBy('finishedDate');
    }

    function initHandlebarHelpers() {
        Handlebars.registerHelper('importance_helper', function (count) {
            let out = "";
            for (var i = 0; i < count; i++) {
                out = out + "<i class=\"fa fa-bolt\"></i>";
            }
            return new Handlebars.SafeString(out);
        });
        Handlebars.registerHelper('edit_button_helper', function (id) {
            return new Handlebars.SafeString("<button name=\"edit" + id + "\" onclick=\"mainModule.onEditClicked(" + id + ")\">Edit</button>");
        });
        Handlebars.registerHelper('checked_helper', function (done) {
            if(done === 1) {
                return new Handlebars.SafeString("checked");
            } else {
                return new Handlebars.SafeString("");
            }
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
            sortNotesBy('finishedDate');
            loadTemplate("#list", "list-template", {"notes": notes});
        });
        $( "#sortByCreatedDate" ).on( "click", function() {
            console.log( "sortByCreatedDate was clicked" );
            sortNotesBy('createdDate');
            loadTemplate("#list", "list-template", {"notes": notes});
        });
        $( "#sortByImportance" ).on( "click", function() {
            console.log( "sortByImportance was clicked" );
            sortNotesBy('importance');
            loadTemplate("#list", "list-template", {"notes": notes});
        });
        $( "#newNote" ).on( "click", function() {
            console.log( "NewNote was clicked" );
        });
        $( "#showFinished" ).on( "click", function() {
            console.log( "ShowFinished was clicked" );
        });
        $( "#styleSelection" ).on( "change", function() {
            console.log( "styleSelection was changed" );
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
