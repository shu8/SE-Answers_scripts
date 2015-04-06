// ==UserScript==
// @name         Will question be deleted?
// @namespace    http://stackexchange.com/users/4337810/%E1%94%95%E1%96%BA%E1%98%8E%E1%95%8A
// @version      1.2
// @description  Adds a message on questions which *might* be deleted by the SE delete bot
// @author       ᔕᖺᘎᕊ (http://stackexchange.com/users/4337810/%E1%94%95%E1%96%BA%E1%98%8E%E1%95%8A)
// @match        *://*.stackexchange.com/*
// @match        *://*.stackoverflow.com/*
// @match        *://*.superuser.com/*
// @match        *://*.serverfault.com/*
// @match        *://*.askubuntu.com/*
// @match        *://*.stackapps.com/*
// @match        *://*.mathoverflow.net/*
// @grant        none
// ==/UserScript==
function addWarning(title) {
    if (! $('#riskOfDeletion').length ) {
        $('#qinfo').append("<tr><td><p class='label-key' id='riskOfDeletion'>Risk of <br />deletion?</p></td><td style='padding-left:10px'><p class='label-key' title='"+title+"'><b>Yes</b></p></td></tr>");    
    }
}

var askedDaysAgo = $('.question-stats td:eq(1) p').text().split(' ')[0],
    voteCount = $('.vote-count-post').text(),
    answerCount = $('#answers-header div h2').text().split(' ')[0],
    id = $(location).attr('href').split('/')[4],
    sitename = $(location).attr('hostname').split('.')[0],
    currentTime = (new Date).getTime(),
    elevenMonths = 28927183,
    nineDays = 777600,
    fifteenDays = 1296000,
    commentCount = $('.question .comment').length;

//More than 30 days old:
if( voteCount <= -1 ) { //if the vote count is <= -1
    if( answerCount.trim() == '' ) { //if there are no answers
        $.getJSON("https://api.stackexchange.com/2.2/questions/" + id + "?order=desc&sort=activity&site=" + sitename, function(json) {
            if( !json.items[0].locked_date ) { //if it isn't locked
                if ( currentTime - json.items[0].creation_date >= fifteenDays ) { //only care if it will happen in the next 15 days
                    addWarning('Within 15 days');
                }
            }
        });
    }
}

//More than 365 days old:
$.getJSON("https://api.stackexchange.com/2.2/questions/" + id + "?order=desc&sort=activity&site=" + sitename, function(json) {
    var creationDate = json.items[0].creation_date,
        score = json.items[0].score,
        answers = json.items[0].answer_count,
        views = json.items[0].view_count;
    
    if( currentTime - creationDate <= elevenMonths ) { //If it's been at least 11 months (we don't care about questions newer than that, yet...)
        if( answers == 0 ) { //if there aren't any answers
            if( !json.items[0].locked_date ) { //if it is not locked
                if( views <= (Math.floor(currentTime/8.64e7) * 1.5)) { //if view count <= the age of the question in days times 1.5
                    if( commentCount <= 1 ) { //if there are 1 or 0 comments
                        addWarning('Within a month');
                    }
                }
            }            
        }        
    }    
});

//More than 9 days since closure:
$.getJSON("https://api.stackexchange.com/2.2/questions/" + id + "?order=desc&sort=activity&site=" + sitename, function(json) {
    if( json.items[0].closed_date ) { //if the question is closed
        var closedDate = json.items[0].closed_date,
            closedReason = json.items[0].closed_reason,
            score = json.items[0].score,
            answers = json.items[0].answer_count;
        
        if( closedReason != 'duplicate' ) { //if it's not been closed as a duplicate
            if( score <= 0 ) { //if the score is less than or equal to 0
                if( !json.items[0].locked_date ) { //if it is not locked
                    if( answerCount == 0 ) { //if it has 0 answers
                        if (!json.items[0].accepted_answer_id) { //if it has no accepted answer
                            addWarning('Within 9 days');
                        }
                    }
                }
            }
        }
    }
});
