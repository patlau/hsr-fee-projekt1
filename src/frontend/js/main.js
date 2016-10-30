'use strict';
/*global Handlebars, $, aboutModule, StyleModule, NoteModule, handlebarModule */
/*jshint unused:false*/

(function() {

    /* ==========================================================================
     Module initializing
     ========================================================================== */

    function initModule() {
        handlebarModule.initHandlebars();
        handlebarModule.loadTemplate("footer", "app-footer-template", aboutModule.about);
        NoteModule.listController.display();
        StyleModule.applyStyle("blackwhite");
    }

    $(document).ready(function () {
        console.log("Start Main Module");
        initModule();
    });

})();


