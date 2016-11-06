'use strict';
/*global Handlebars, $ */
/*jshint unused:false*/

var StyleModule = (function($) {

    var selectedStyle = null;
    var styles = [
        {name: 'Black-and-White', id: 'bw'},
        {name: 'Blue', id: 'blue'}
    ];

    function isValidStyle(style) {
        return !!styles.find(each => each.id === style);
    }

    function publicApplyStyle(style) {
        if (isValidStyle(style)) {
            selectedStyle = style;
            console.log('STYLE', selectedStyle);
            localStorage.setItem('style', selectedStyle);
            $('link#theme-css').attr('href', 'css/style-' + selectedStyle + '.css');
        }
    }

    function publicSelectedStyle() {
        if(!selectedStyle) {
            let style = localStorage.getItem('style');
            if (isValidStyle(style)) {
                selectedStyle = style;
            } else {
                selectedStyle = styles[0].id;
            }
        }
        return selectedStyle;
    }

    function publicInit(id) {
        let selected = publicSelectedStyle();
        publicApplyStyle(selected);
        let styleSwitcher = $(id);
        if(styleSwitcher) {
            styles.forEach(each => {
                console.log('ADD', each);
                styleSwitcher.append($('<option></option>')
                    .attr('value', each.id).attr('selected', (each.id === selected)).text(each.name))
            });
        }
        styleSwitcher.on( "change", function() {
            publicApplyStyle($(this).val());
        });
    }

    return {
        selected: publicSelectedStyle,
        apply: publicApplyStyle,
        init: publicInit
    };

})(jQuery);
