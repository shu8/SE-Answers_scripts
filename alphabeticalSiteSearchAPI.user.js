// ==UserScript==
// @name         Make API site search alphabetical
// @namespace    http://stackexchange.com/users/4337810/
// @version      1.0
// @description  Makes the list of sites under the site search on api.stackexchange.com alphabetical
// @author       ᔕᖺᘎᕊ (http://stackexchange.com/users/4337810/)
// @match        *://api.stackexchange.com/*
// @grant        none
// ==/UserScript==


var userscript = function($) {
    setTimeout(function() {
        console.log('start');
        //Thanks to http://stackoverflow.com/a/1134983/3541881 for the main sorting part of the script!
        $('.site-picker.ui-autocomplete-input').on('input', function() {
            console.log('change');
            setTimeout(function() {
                var mylist = $('body > ul.ui-autocomplete');
                var listitems = mylist.children('li').get();
                listitems.sort(function(a, b) {
                    return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
                })
                $.each(listitems, function(idx, itm) { mylist.append(itm); });
            }, 500);
        });
    }, 1000);
};

var el = document.createElement('script');
el.type = 'text/javascript';
el.text = '(' + userscript + ')(jQuery);';
document.head.appendChild(el);
