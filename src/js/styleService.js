'use strict';
/*global Handlebars, $ */
/*jshint unused:false*/

var StyleModule = (function() {

    /* ==========================================================================
     Variables
     ========================================================================== */

    var selectedStyle = "blackwhite"; // Default style


    /* ==========================================================================
     Styling
     ========================================================================== */

    function applyStyle(newStyle) {
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

    return {
        applyStyle: applyStyle
    };

})();
