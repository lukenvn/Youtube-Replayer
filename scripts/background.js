/**
 * Created by luke on 04/07/2017.
 */

var repeatAtB =false;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "enable_auto_repeat_at_b" ) {
            repeatAtB = request.enable;

            console.log("receive request update checkAutoRepeatAtB:"+ repeatAtB);
        }
    }
);
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "check_auto_repeat_at_b" ) {
            console.log("receive request check checkAutoRepeatAtB");
            sendResponse({enableRepeat:repeatAtB });
        }
    }
);