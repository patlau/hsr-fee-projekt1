/*global Handlebars, $*/
/*exported onEditClicked*/
/*jshint unused:false*/

var mainModule = (function() {

    /* ==========================================================================
     Variables
     ========================================================================== */

    var templateCache = {}; // Handlebars compiled template cache
    var selectedStyle = "blackwhite"; // Default style

    var sortOrder = 1; // Default Note sort order
    var sortBy = null; // Default Note sort by
    var showFinished = 0; // Do not show done Notes by default

    var about = {
        project: 'HSR FEE Projekt 1',
        student: 'Patrick Lauper'
    };

    /* This will later be loaded from storage */
    var notesJson = [
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

    var allNotes = []; // All notes
    var notes = []; // Filtered notes

    /* ==========================================================================
     Note class / Just to try out ...
     ========================================================================== */

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


    /* ==========================================================================
     Handlebar
     ========================================================================== */

    /*
     * Load Handlebars template and update DOM if a selector is given.
     * Each template is also registered as partial, so it can
     * be reused.
     */
    function loadTemplate(jQuerySelector, templateId, context) {
        let template = templateCache[templateId];
        if (template === undefined) {
            //console.log("Compile template " + templateId);
            let source = $('#' + templateId).html();
            template = Handlebars.compile(source);
            templateCache[templateId] = template;
            Handlebars.registerPartial(templateId, template);
        }
        if (jQuerySelector !== "") {
            //console.log("Updating template " + templateId);
            var html = template(context);
            $(jQuerySelector).html(html);
        }
    }

    function loadTemplates() {
        loadTemplate("", "list-entry-template", {});
        loadTemplate("main", "master-template", {});
        loadTemplate("#list", "list-template", {"notes": notes});
        loadTemplate("footer", "app-footer-template", about);
    }

    function initHandlebarHelpers() {
        Handlebars.registerHelper('importance_helper', function (count) {
            let out = "";
            for (var i = 0; i < count; i++) {
                out = out + "<i class=\"fa fa-bolt\"></i>";
            }
            return new Handlebars.SafeString(out);
        });
        Handlebars.registerHelper('checked_helper', function (done) {
            if(done === 1) {
                return new Handlebars.SafeString("checked");
            } else {
                return new Handlebars.SafeString("");
            }
        });
        Handlebars.registerHelper('date_helper', function(dueDate) {
            let due = new Date(dueDate);
            //console.log(due);
            let now = Date.now();
            if(now === due) {
                return "[Today]";
            } else {
                return due.toLocaleDateString();
            }
        });
    }

    /* ==========================================================================
     Note loading, sorting and filter
     ========================================================================== */

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

    function filterNotes() {
        if(showFinished === 1) {
            notes = allNotes;
        } else {
            notes = allNotes.filter(function(each) {
                return each.done === 0;
            });
        }
    }

    // Load notes, convert to Note objects and apply filter and sort order
    function loadNotes() {
        let data = notesJson;
        for (let item of data) {
            let note = $.extend(new Note(), item);
            allNotes.push(note);
        }
        filterNotes();
        sortNotesBy("finishedDate");
    }

    /* ==========================================================================
     Styling
     ========================================================================== */

    function setStyle(newStyle) {
        $("button").each(function() {
            //console.log($(this));
            //console.log(" Remove: " + selectedStyle + " Add: " + newStyle);
            $(this).removeClass(selectedStyle);
            $(this).addClass(newStyle);
        });
        selectedStyle = newStyle;
    }

    /* ==========================================================================
     Events
     ========================================================================== */

    function onEditClicked(id) {
        //console.log(id);
    }

    function registerEventHandlers() {
        $( "#sortByFinishDate" ).on( "click", function() {
            //console.log( "SortByFinishDate was clicked" );
            sortNotesBy('finishedDate');
            loadTemplate("#list", "list-template", {"notes": notes});
        });
        $( "#sortByCreatedDate" ).on( "click", function() {
            //console.log( "sortByCreatedDate was clicked" );
            sortNotesBy('createdDate');
            loadTemplate("#list", "list-template", {"notes": notes});
        });
        $( "#sortByImportance" ).on( "click", function() {
            //console.log( "sortByImportance was clicked" );
            sortNotesBy('importance');
            loadTemplate("#list", "list-template", {"notes": notes});
        });
        $( "#newNote" ).on( "click", function() {
            //console.log( "NewNote was clicked" );
        });
        $( "#showFinished" ).on( "click", function() {
            //console.log( "ShowFinished was clicked" );
            showFinished = showFinished === 1 ? 0 : 1;
            $(this).toggleClass("down");
            filterNotes();
            loadTemplate("#list", "list-template", {"notes": notes});
        });
        $( "#styleSelection" ).on( "change", function() {
            //console.log( "styleSelection was changed" );
            setStyle($(this).val());
        });
        $('#list-container').on('click', '.edit', function() {
            let noteId = $(this).closest(".list-row-container").data().noteId;
            console.log("Edit: " + noteId);
        });
    }

    /* ==========================================================================
     Module initializing
     ========================================================================== */

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
