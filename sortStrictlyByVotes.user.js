// ==UserScript==
// @name         Sort by votes, properly...
// @namespace    http://stackexchange.com/users/4337810
// @version      1.4
// @description  Adds a new option on questions to sort answers by votes *ignoring the accepted answer* - unlike the current 'votes' tab.
// @author       ᔕᖺᘎᕊ (http://stackexchange.com/users/4337810)
// @match        *://*.stackexchange.com/*
// @match        *://*.stackoverflow.com/*
// @match        *://*.superuser.com/*
// @match        *://*.serverfault.com/*
// @match        *://*.askubuntu.com/*
// @match        *://*.stackapps.com/*
// @match        *://*.mathoverflow.net/*
// @grant        none
// ==/UserScript==

setTimeout(function() {
    if ( $('.answer').length ) {
        $('.answer').each(function() {
            const votes = $(this).find('.js-vote-count').text();
            $(this).attr('data-votes', votes); //add a 'votes' attribute to all the questions
        });

        const $header = $('#answers-header');
        const $option = $('<option/>', { id: 'actualscoredesc-sort', value: 'actualscoredesc', text: 'Highest score (actual)' });

        $('#answer-sort-dropdown-select-menu').append($option);

        if(document.URL.indexOf('?answertab=actualscoredesc') !== -1) {
            //Thanks: http://stackoverflow.com/a/14160529/3541881
            $('#answers').find('.answer').sort(function(a, b) {
                return +b.getAttribute('data-votes') - +a.getAttribute('data-votes');
            }).insertAfter($header);
            $option.prop('selected', true);
        }

        if($(location).attr('href').indexOf('#') > -1) { //if the user came to see a specific answer (via the URL), take them to that answer again!
            setTimeout(function() { //scroll back to
                $(window).scrollTop($("#answer-"+$(location).attr('href').split('/')[6].split('#')[1]).offset().top);
            }, 2000);
        }
    }
}, 100);
