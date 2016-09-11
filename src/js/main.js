/* global Handlebars, $ */

(function() {

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
        loadTemplate("header", "#header-template", {});
        loadTemplate("main", "#list-template", {});
        loadTemplate("footer", "#footer-template", getAbout());
    }

    $(document).ready(function () {
        loadTemplates();
    });

})();

