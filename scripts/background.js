/**
 * Created by luke on 04/07/2017.
 */
"use strict";
var repeatAtB = false;
var ReplayerBackground = ReplayerBackground || {};
ReplayerBackground.control = {
    registerListenerPageAction: function () {
        chrome.runtime.onInstalled.addListener(function () {
            chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
                chrome.declarativeContent.onPageChanged.addRules([
                    {
                        conditions: [
                            new chrome.declarativeContent.PageStateMatcher({
                                pageUrl: {urlContains: 'www.youtube.com'},
                            })
                        ],
                        actions: [new chrome.declarativeContent.ShowPageAction()]
                    }
                ]);
            });
        });
    },
    registerListenerMessage: function () {
        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.message === "enable_auto_repeat_at_b") {
                repeatAtB = request.enableRepeatAtB;
            }
            else if (request.message === "check_auto_repeat_at_b") {
                sendResponse({enableRepeatAtB: repeatAtB});
            }
        });
    }
};
ReplayerBackground.control.registerListenerMessage();
ReplayerBackground.control.registerListenerPageAction();