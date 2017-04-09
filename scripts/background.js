/**
 * Created by luke on 04/07/2017.
 */

var repeatAtB =false;

function registerListenerPageAction(){
    chrome.runtime.onInstalled.addListener(function() {
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
            chrome.declarativeContent.onPageChanged.addRules([
                {
                    conditions: [
                        new chrome.declarativeContent.PageStateMatcher({
                            pageUrl: { urlContains: 'www.youtube.com' },
                        })
                    ],
                    actions: [ new chrome.declarativeContent.ShowPageAction() ]
                }
            ]);
        });
    });
}
function registerListenerMessage(){
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if( request.message === "enable_auto_repeat_at_b" ) {
            repeatAtB = request.enable;
            console.log("receive request update checkAutoRepeatAtB:"+ repeatAtB);
        }
    });
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if( request.message === "check_auto_repeat_at_b" ) {
            console.log("receive request check checkAutoRepeatAtB");
            sendResponse({enableRepeat:repeatAtB });
        }
    });
}


registerListenerMessage();
registerListenerPageAction();