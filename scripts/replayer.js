"use strict";
var Replayer = Replayer || {};
var videoPlayer, startInput, endInput, startBtn, endBtn, repeatCheckbox, messageBox, checkBoxContainer;
var replayTimer;
var Z_CODE = 90, X_CODE = 88, C_CODE = 67, S_CODE = 83, Shift_CODE = 16, D_CODE = 68;
var down = {};
var enableRepeatAtB;
var controlObj;

var A_TOOLTIP_MESSAGE =  "Press 'Shift' + 'Z' keys instead";
var B_TOOLTIP_MESSAGE =  "Press 'Shift' + 'X' keys instead";
var CHECKBOX_TOOLTIP_MESSAGE =  "Press 'Shift' + 'S' keys instead";
var MESSAGE_BOX_MESSAGE="Press 'Shift' + 'C' to clear the replay";
var REPLAY_LABEL ='Replay';
Replayer.control = {
    initControlBar: function (controlElement) {
        var repeatMainControl = $("<div>").attr("id", "repeatMainControl");
        repeatMainControl.append(this.initStartInputContainer());
        repeatMainControl.append(this.initEndInputContainer());
        repeatMainControl.append(this.initRepeatCheckBox());
        repeatMainControl.append(this.initMessageBox());
        controlElement.append(repeatMainControl);
        controlObj.enableTooltip();
        controlObj.listenForMainControl();
    }, enableTooltip: function () {
        Utils.addBottomToolTip(startBtn, A_TOOLTIP_MESSAGE);
        Utils.addBottomToolTip(endBtn, B_TOOLTIP_MESSAGE);
        Utils.addBottomToolTip(checkBoxContainer, CHECKBOX_TOOLTIP_MESSAGE);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    },
    initStartInputContainer: function () {
        var startMainControl = $('<div>').addClass("one-line").attr('id', 'startContainer');
        var childMainControl = $('<div>').addClass("input-group");
        startInput = $("<input>").attr('id', 'startInput').addClass("form-control input-text");
        var spanGroup = $("<span>").addClass("input-group-btn");
        startBtn = $("<button>").attr('id', 'startBtn').addClass("btn btn-default").text("A");
        spanGroup.append(startBtn);
        childMainControl.append(spanGroup);
        childMainControl.append(startInput);
        startMainControl.append(childMainControl);
        return startMainControl;
    },
    initEndInputContainer: function () {
        var endMainControl = $('<div>').addClass("one-line").attr('id', 'endContainer');
        var childMainControl = $('<div>').addClass("input-group");
        endInput = $("<input>").attr('id', 'startInput').addClass("form-control input-text");
        var spanGroup = $("<span>").addClass("input-group-btn");
        endBtn = $("<button>").addClass("btn btn-default").text("B");
        spanGroup.append(endBtn);
        childMainControl.append(spanGroup);
        childMainControl.append(endInput);
        endMainControl.append(childMainControl);
        return endMainControl;
    },
    initRepeatCheckBox: function () {
        checkBoxContainer = $('<div>').attr('id', 'checkboxContainer').addClass("checkbox-on-off");
        var span = $(' <span id ="checkboxSpan" class=" yt-uix-checkbox-on-off ">');
        repeatCheckbox = $('<input id="myCheckBox" class="" type="checkbox">');
        span.append(repeatCheckbox);
        checkBoxContainer.append($('<label for="myCheckBox"/>').text(REPLAY_LABEL));
        span.append('<label for="myCheckBox" id="autoplay-checkbox-label" class=""><span class="checked"></span><span class="toggle"></span><span class="unchecked"></span></label>');
        checkBoxContainer.append(span);
        return checkBoxContainer;
    },
    initMessageBox: function () {
        messageBox = $('<div>').attr("id", "messageBox").addClass("collapse");
        messageBox.text(MESSAGE_BOX_MESSAGE);
        return messageBox;
    },
    isRepeatEnable: function () {
        return repeatCheckbox.is(':checked');
    },
    setValueForStartInput: function (value) {
        startInput.val(Utils.secondsToString(value));
    },
    setValueForEndInput: function (value) {
        endInput.val(Utils.secondsToString(value));
    },
    enableRepeatCheckbox: function (value) {
        repeatCheckbox.prop('checked', value);
    },
    repeatVideo: function () {
        replayTimer = setInterval(function () {
            console.log("loop");
            if (controlObj.isRepeatEnable()) {
                var currentTime = videoPlayer.currentTime;
                var endTime = Utils.stringToSeconds(endInput.val());
                if (currentTime >= endTime || currentTime >= videoPlayer.duration) {
                    controlObj.repeat();
                }
            } else {
                controlObj.clearRepeater();
            }
        }, 500);
    },
    repeat: function () {
        videoPlayer.currentTime = Utils.stringToSeconds(startInput.val());
        videoPlayer.play();
    },
    clearRepeater: function () {
        clearInterval(replayTimer);
    },
    reInitValue: function () {
        this.setValueForStartInput(0);
        if (isNaN(videoPlayer.duration)) {
            console.log("isNaN");
            setTimeout(function () {
                console.log("after 3 seconds");
                controlObj.setValueForEndInput(videoPlayer.duration);
            }, 3000);
        } else {
            this.setValueForEndInput(videoPlayer.duration);
        }
        this.enableRepeatCheckbox(false);
    }
    ,
    listenForKey: function () {
        $(window).keydown(function (e) {
            down[e.keyCode] = true;
        }).keyup(function (e) {
            var fromPress = down[Shift_CODE] && down[Z_CODE];
            var toPress = down[Shift_CODE] && down[X_CODE];
            var repeatPress = down[Shift_CODE] && down[S_CODE];
            var resetPress = down[Shift_CODE] && down[C_CODE];
            var replayNowPress = down[Shift_CODE] && down[D_CODE];
            if (fromPress) {
                startBtn.click();
            } else if (toPress) {
                endBtn.click();
            } else if (repeatPress) {
                repeatCheckbox.click();
            } else if (resetPress) {
                controlObj.clearRepeater();
                controlObj.reInitValue();
            } else if (replayNowPress) {
                controlObj.repeat();
            }
            down[e.keyCode] = false;
        });
    },
    listenForMainControl: function () {
        startBtn.click(function () {
            controlObj.setValueForStartInput(videoPlayer.currentTime);
        });
        endBtn.click(function () {
            controlObj.setValueForEndInput(videoPlayer.currentTime);
            controlObj.checkAutoRepeatAtB();
        });
        repeatCheckbox.change(function () {
            $('.collapse').collapse();
            if (endInput.val()) {
                if (controlObj.isRepeatEnable()) {
                    controlObj.repeatVideo();
                } else {
                    clearInterval(replayTimer);
                }
            }
        });
    },
    checkAutoRepeatAtB: function () {
        chrome.runtime.sendMessage({message: "check_auto_repeat_at_b"}, function (response) {
            enableRepeatAtB = response.enableRepeatAtB;
            if (enableRepeatAtB) {
                controlObj.enableRepeatCheckbox(enableRepeatAtB);
                controlObj.repeatVideo();
            }
        });
    },
    addReplayBar: function () {
        videoPlayer = document.getElementsByClassName("html5-main-video")[0];
        if (videoPlayer) {
            videoPlayer.addEventListener('loadedmetadata', function (e) {
                console.log("load video");
                if (!controlObj.mainControlAlreadyExist()) {
                    Replayer.control.init();
                }
            });
            Replayer.control.init();
            clearInterval(initTimerId);
        }
        else if (!initTimerId) {
            initTimerId = setInterval(controlObj.addReplayBar, 1000);
        }
    },
    init: function () {
        var videoControls = $('#watch-header');
        if (videoControls.length) {
            Replayer.control.initControlBar(videoControls);
            Replayer.control.reInitValue();
            Replayer.control.listenForKey();
        }
    },
    mainControlAlreadyExist: function () {
        if($('#repeatMainControl').length){
            return true;
        }
        return false;
    }
};
var Utils = {
    stringToSeconds: function (time) {
        var smh = time.split(":"), seconds = 1;
        for (var i = 0; i < smh.length; i++) {
            seconds += smh[i] * Math.pow(60, smh.length - 1 - i);
        }
        return seconds;
    },
    secondsToString: function (time) {
        var string = "";
        if (time >= 60) {
            var smh = [];
            while (parseInt(time) > 0) {
                smh.push(parseInt(time % 60));
                time /= 60;
            }
            for (var i = smh.length - 1; i >= 0; i--) {
                var t = smh[i];
                string += (i != smh.length - 1 && t < 10) ? "0" + t : t;
                if (i > 0) {
                    string += ":";
                }
            }
        } else {
            string = "0:" + parseInt(time);
        }
        return string;
    },
    addBottomToolTip: function (element, message) {
        element.attr('data-toggle', 'tooltip').attr('data-placement', 'bottom').attr('title', message);
    }
};

var initTimerId;
setTimeout(function () {
    controlObj = Replayer.control;
    Replayer.control.addReplayBar();
}, 1000);

