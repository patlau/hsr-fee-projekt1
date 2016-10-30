'use strict';
/*global Handlebars, $ */
/*jshint unused:false*/

var handlebarModule = (function() {

    /* ==========================================================================
     Variables
     ========================================================================== */

    var templateCache = {}; // Handlebars compiled template cache

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

    function initHandlebarHelpers() {
        Handlebars.registerHelper('importance_helper', function (count) {
            let out = "";
            for (var i = 0; i < count; i++) {
                out = out + "<i class=\"fa fa-bolt\"></i>";
            }
            return new Handlebars.SafeString(out);
        });
        Handlebars.registerHelper('checked_helper', function (done) {
            if(done) {
                return new Handlebars.SafeString("checked");
            } else {
                return new Handlebars.SafeString("");
            }
        });
        Handlebars.registerHelper('date_helper', function(date) {
            if(date === null || date === undefined || date === '') {
                return '';
            }
            let dateObject = null;
            if(date instanceof Date) {
                dateObject = date;
            } else {
                dateObject = new Date(date);
            }
            let now = Date.now();
            if(now.valueOf() === dateObject.valueOf()) {
                return "[Today]";
            } else {
                return dateObject.toLocaleDateString();
            }
        });
        Handlebars.registerHelper('date_iso_helper', function(date) {
            if(date === null || date === undefined || date === '') {
                return '';
            }
            return date.toDateISOString();
        });
    }

    /* ==========================================================================
     Module initializing
     ========================================================================== */

    function initHandlebars() {
        initHandlebarHelpers();
    }

    return {
        initHandlebars: initHandlebars,
        loadTemplate: loadTemplate
    };

})();
