/*global Handlebars, $, aboutModule, storageModule */
/*exported onEditClicked*/
/*jshint unused:false*/

var mainModule = (function() {

    /* ==========================================================================
     Variables
     ========================================================================== */

    var templateCache = {}; // Handlebars compiled template cache
    var selectedStyle = "blackwhite"; // Default style

    var listOptions = {
        sortOrder: 1, // Default Note sort order
        sortBy: 'createdDate', // Default Note sort by
        showFinished: 0 // Do not show done Notes by default
    };



    var allNotes = []; // All notes
    var notes = []; // Filtered notes

    /* ==========================================================================
     Note class / Just to try out ...
     ========================================================================== */

    function Note(id, title, description, importance, done, createdDate, finishedDate) {
        this.id = id;
        this.description = description;
        this.importance = importance;
        this.done = done;
        this.createdDate = createdDate;
        this.finishedDate = finishedDate;
    }

    /* ==========================================================================
     Handlebar
     ========================================================================== */

    /*
     * Load and compile Handlebars template and update DOM if a selector is given.
     * Each template is also registered as partial, so it can be reused.
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
        loadTemplate("footer", "app-footer-template", aboutModule.about);
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
        Handlebars.registerHelper('date_helper', function(dateStr) {
            if(dateStr === null || dateStr === undefined || dateStr === '') {
                return '';
            }
            let date = new Date(dateStr);
            let now = Date.now();
            if(now.valueOf() === date.valueOf()) {
                return "[Today]";
            } else {
                return date.toLocaleDateString();
            }
        });
    }

    /* ==========================================================================
     Note loading, sorting and filter
     ========================================================================== */

    function toggleSortOrder(prop) {
        // If same sort property, toggle sort order (ascending, descending)
        if(listOptions.sortBy === prop) {
            listOptions.sortOrder = (listOptions.sortOrder === 1) ? 0 : 1;
        }
    }

    function sortNotesBy(prop) {

        notes = notes.sort(function(a, b) {
            if (listOptions.sortOrder) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });

        // Keep last sort property for refreshing list
        listOptions.sortBy = prop;

    }

    function filterNotes() {
        if(listOptions.showFinished === 1) {
            notes = allNotes;
        } else {
            notes = allNotes.filter(function(each) {
                return each.done === 0;
            });
        }
    }

    // Load notes, convert to Note objects and apply filter and sort order
    function loadNotes() {
        let data = storageModule.loadNotes();
        for (let item of data) {
            let note = $.extend(new Note(), item);
            allNotes.push(note);
        }
        filterNotes();
        sortNotesBy(listOptions.sortBy);
    }

    function addNote() {
        let note = new Note(allNotes.length + 1, 'Neue Notiz', 'Beschreibung', 0, new Date().toISOString(), 0, new Date().toISOString(), '');
        allNotes.push(note);
    }

    /* ==========================================================================
     Styling
     ========================================================================== */

    function setStyle(newStyle) {
        /*$("button").each(function() {
            //console.log($(this));
            //console.log(" Remove: " + selectedStyle + " Add: " + newStyle);
            $(this).removeClass(selectedStyle);
            $(this).addClass(newStyle);
        });
        */
        $("body")
            .removeClass(selectedStyle)
            .addClass(newStyle);

        selectedStyle = newStyle;
    }

    /* ==========================================================================
     Events
     ========================================================================== */

    function sortButtonClicked(sortProperty) {
        toggleSortOrder(sortProperty);
        sortNotesBy(sortProperty);
        loadTemplate("#list", "list-template", {"notes": notes});
    }

    function refreshList() {
        filterNotes();
        sortNotesBy(listOptions.sortBy);
        loadTemplate("#list", "list-template", {"notes": notes});
    }

    function registerEventHandlers() {
        $( ".sortButton" ).on( "click", function() {
            sortButtonClicked($(this).data().sortBy);

            // Update sort icon
            $(this).find('i').toggleClass('fa-sort-asc', listOptions.sortOrder === 1);
            $(this).find('i').toggleClass('fa-sort-desc', listOptions.sortOrder === 0);

            // Show or hide sort icon
            $('.sortButton > i').addClass('hidden');
            $(this).find('i').toggleClass('hidden');

        });
        $( "#newNote" ).on( "click", function() {
            addNote();
            refreshList();
        });
        $( "#showFinished" ).on( "click", function() {
            listOptions.showFinished = listOptions.showFinished === 1 ? 0 : 1;
            $(this).toggleClass("down");
            refreshList();
        });
        $( "#styleSelection" ).on( "change", function() {
            //console.log( "styleSelection was changed" );
            setStyle($(this).val());
        });
        // Register event handler must be called always after setting list
        $('#list').on('click', '.edit', function() {
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
        initModule: initModule
    };

})();

$(document).ready(function () {
    console.log("Start Main Module");
    mainModule.initModule();
});
