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
        committer: 'plauper@yahoo.com',
        build: 'localbuild',
        commit: '',
        branch: 'master',
        datetime: '2016-10-02T10:18:09.670Z'
    };

    return {
        about: about
    };

})();
