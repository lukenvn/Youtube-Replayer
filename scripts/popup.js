/**
 * Created by luke on 03/29/2017.
 */
"use strict";
var ReplayerPopup =  ReplayerPopup||{};
var replayBCheckbox;
ReplayerPopup.control = {
    checkboxListener: function () {
        replayBCheckbox = $('#repeatBCheckbox');
        replayBCheckbox.click(function () {
            ReplayerPopup.control.sendNotification(ReplayerPopup.control.isReplayChecked());
        });
    },
    enableReplayBCheckbox: function (value) {
        replayBCheckbox.prop('checked', value);
    },
    checkAutoReplayerAtB: function () {
        chrome.runtime.sendMessage({message: "check_auto_repeat_at_b"}, function (response) {
            ReplayerPopup.control.enableReplayBCheckbox(response.enableRepeatAtB);
        });
    },
    isReplayChecked: function () {
        return replayBCheckbox.is(':checked');
    },
    sendNotification: function (value) {
        chrome.runtime.sendMessage({"message": "enable_auto_repeat_at_b", "enableRepeatAtB": value});
    }
};
$(function () {
    ReplayerPopup.control.checkboxListener();
    ReplayerPopup.control.checkAutoReplayerAtB();
});
