/**
 * Created by luke on 03/29/2017.
 */

function notifyAutoRepeatWhenBSetting() {


}
var replayBCheckbox, enableRepeatAtB;
function checkboxListener() {
    replayBCheckbox = $('#repeatBCheckbox');
    replayBCheckbox.click(function () {
        if (isReplayChecked()) {
            sendNotification(true);
        } else {
            sendNotification(false);
        }
        console.log("change :" + isReplayChecked());
    });
}
function enableReplayBCheckbox(value) {
    replayBCheckbox.prop('checked', value);
}

function checkAutoRepeatAtB() {
    chrome.runtime.sendMessage({message: "check_auto_repeat_at_b"}, function (response) {
        enableReplayBCheckbox(response.enableRepeat);
    });
}
function isReplayChecked() {
    return replayBCheckbox.is(':checked');
}
function sendNotification(value) {
// This line is new!
    chrome.runtime.sendMessage({"message": "enable_auto_repeat_at_b", "enable": value});
}
$(function () {
    notifyAutoRepeatWhenBSetting();
    checkboxListener();
    checkAutoRepeatAtB();
});
