'use strict';
/*global Handlebars, $*/
/*exported onEditClicked*/
/*jshint unused:false*/

/*
 * This data will be filled out by the build process with CI server data.
 */

var aboutModule = (function(){

    var about = {
        project: '@@PROJECT',
        committer: '@@COMMITTER',
        build: '@@BUILD',
        commit: '@@COMMIT',
        branch: '@@BRANCH',
        datetime: '@@DATETIME'
    };

    return {
        about: about
    };

})();
