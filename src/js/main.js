/* global Handlebars, $ */

(function() {

    function loadTemplate(jQuerySelector, templateId, context) {
        var source = $(templateId).html();
        var template = Handlebars.compile(source);
        var html    = template(context);
        $(jQuerySelector).html(html);
    }

    function loadTemplates() {
        loadTemplate("footer", "#footer-template", {about: 'HSR FEE Projekt 1'});
    }

    $(document).ready(function () {
        loadTemplates();
    });

})();

