/* global Handlebars, $ */

(function() {

    /*function Note(title, description, importance, due, done) {
        this.description = description;
        this.importance = importance;
        this.due = due;
        this.done = done;
    }*/

    function getAbout() {
        return {
            project: 'HSR FEE Projekt 1',
            student: 'Patrick Lauper'
        };
    }

    function loadTemplate(jQuerySelector, templateId, context) {
        var source = $(templateId).html();
        var template = Handlebars.compile(source);
        var html    = template(context);
        $(jQuerySelector).html(html);
    }

    function loadTemplates() {
//        loadTemplate("header", "#header-template", {});
        loadTemplate("main", "#master-template", {"notes": []});
        loadTemplate(".app-footer", "#app-footer-template", getAbout());
    }

    function loadNotes() {
        console.log("Load notes");
        $.getJSON( "test-data/notes.json")
            .done(function( data ) {
                console.log(data);
                //for (let item of data) {
                //    let note = $.extend(new Note(), item);
                //    console.log(note);
                //}
                loadTemplate("main", "#master-template", {"notes": data});
            })
            .fail(function( data ) {
                console.log( "error: " + data );
            })
            .always(function() {
                console.log( "complete" );
            });
    }

    $(document).ready(function () {
        loadTemplates();
        loadNotes();
    });

})();

