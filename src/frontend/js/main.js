'use strict';
/*global Handlebars, $, aboutModule, StyleModule, NoteModule, handlebarModule */
/*jshint unused:false*/

(function($, handlebarModule, noteModule, styleModule) {

    /* ==========================================================================
     Module initializing
     ========================================================================== */

    function initModules() {
        handlebarModule.initHandlebars();
        handlebarModule.loadTemplate("footer", "app-footer-template", aboutModule.about);
        noteModule.listController.display();
    }

    $(document).ready(function () {
        console.log("Start Main Module");
        initModules();
    });

})(jQuery, handlebarModule, NoteModule, StyleModule);


