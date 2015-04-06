// ==UserScript==
// @name         Sort by votes, properly...
// @namespace    http://stackexchange.com/users/4337810
// @version      1.1
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
            votes = $(this).find('.vote-count-post').text();
            $(this).attr('data-votes', votes); //add a 'votes' attribute to all the questions
        });

        var $wrapper = $('#answers');

        $('#answers-header').insertBefore('#answers');
        $('#tabs').append('<a href="javascript:void(0)" id="realVotesTab" title="Answers with the highest score first (ignoring accepted answers!)">real votes</a>');

        $('#realVotesTab').on('click', function() {
            $('#tabs a').removeClass('youarehere');
            $(this).addClass('youarehere');       
            //Thanks: http://stackoverflow.com/a/14160529/3541881
            $wrapper.find('.answer').sort(function(a, b) {
                return +b.getAttribute('data-votes') - +a.getAttribute('data-votes');
            }).prependTo($wrapper);
        });    
        
        //Comment out the next 3 lines if you do not want the 'real votes' tab to automatically be chosen when yuo first arrive at a question (ie. prepend "//" to the next 3 lines)
        if(document.URL.indexOf('?answertab=') == -1) {
           $('#realVotesTab').trigger('click');
        }
    }
}, 100);
