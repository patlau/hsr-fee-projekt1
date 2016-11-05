'use strict';
/*global Handlebars, $*/
/*exported onEditClicked*/
/*jshint unused:false*/

/*
 * This data will be filled out by the build process with CI server data.
 */

var aboutModule = (function(){

    var about = {
        project: 'projekt1',
        committer: '',
        build: 'localbuild',
        commit: '',
        branch: 'master',
        datetime: '2016-11-05T16:00:31.155Z'
    };

    return {
        about: about
    };

})();
