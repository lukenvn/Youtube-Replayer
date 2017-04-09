"use strict";
var Replayer = Replayer || {};
var videoPlayer, startInput, endInput, startBtn, endBtn, repeatCheckbox, messageBox, checkBoxContainer;
var replayTimer, initTimerId;
var Z_CODE = 90, X_CODE = 88, C_CODE = 67, S_CODE = 83, Shift_CODE = 16, D_CODE = 68;
var downKeysMap = {};
var enableRepeatAtB;
var controlObj;
var REPLAY_LABEL = 'Replay';
var MESSAGE = {
    A_TOOLTIP: "Press 'Shift' + 'Z' keys instead",
    B_TOOLTIP: "Press 'Shift' + 'X' keys instead",
    CHECKBOX_TOOLTIP: "Press 'Shift' + 'S' keys instead",
    CLEAR_AB: "Press 'Shift' + 'C' to clear the replay",
    TIME_RANGE_INVALID: "A and B are invalid!"
};
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
        Utils.addBottomToolTip(startBtn, MESSAGE.A_TOOLTIP);
        Utils.addBottomToolTip(endBtn, MESSAGE.B_TOOLTIP);
        Utils.addBottomToolTip(checkBoxContainer, MESSAGE.CHECKBOX_TOOLTIP);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    },
    initStartInputContainer: function () {
        var startMainControl = $('<div id="startContainer" class="one-line">');
        var childMainControl = $('<div class="input-group">');
        startInput = $("<input id='startInput' class='form-control input-text'>");
        var spanGroup = $("<span class='input-group-btn'>");
        startBtn = $("<button id='startBtn' class='btn btn-primary'>").text("A");
        spanGroup.append(startBtn);
        childMainControl.append(spanGroup);
        childMainControl.append(startInput);
        startMainControl.append(childMainControl);
        return startMainControl;
    },
    initEndInputContainer: function () {
        var endMainControl = $('<div id="endContainer" class="one-line">');
        var childMainControl = $('<div class="input-group">');
        endInput = $("<input id='endInput' class='form-control input-text'>");
        var spanGroup = $("<span class='input-group-btn'>");
        endBtn = $("<button class='btn btn-primary'>").text("B");
        spanGroup.append(endBtn);
        childMainControl.append(spanGroup);
        childMainControl.append(endInput);
        endMainControl.append(childMainControl);
        return endMainControl;
    },
    initRepeatCheckBox: function () {
        checkBoxContainer = $('<div id="checkboxContainer" class="checkbox-on-off">');
        var span = $(' <span id ="checkboxSpan" class=" yt-uix-checkbox-on-off ">');
        repeatCheckbox = $('<input id="myCheckBox" type="checkbox">');
        span.append(repeatCheckbox);
        checkBoxContainer.append($('<label for="myCheckBox" />').text(REPLAY_LABEL));
        span.append('<label for="myCheckBox" id="autoplay-checkbox-label" class=""><span class="checked"></span><span class="toggle"></span><span class="unchecked"></span></label>');
        checkBoxContainer.append(span);
        return checkBoxContainer;
    },
    initMessageBox: function () {
        messageBox = $('<div id="messageBox" class="collapse">');
        messageBox.text(MESSAGE.CLEAR_AB);
        return messageBox;
    },
    showErrorMessage: function (message) {
        messageBox.addClass('errorMessageText');
        controlObj.showMessage(message);
    },
    showMessage: function (message) {
        messageBox.text(message);
    }
    ,
    clearErrorMessage: function () {
        if (messageBox.attr('class').indexOf('error') >= 0) {
            messageBox.removeClass();
            messageBox.text('');
        }
    }
    ,
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
    timeRangeIsValid: function () {
        return startInput.val() < endInput.val();
    },
    showGuildMessage: function (valid) {
        if (!valid) {
            controlObj.enableRepeatCheckbox(false);
            Replayer.control.showErrorMessage(MESSAGE.TIME_RANGE_INVALID);
            return;
        }
        Replayer.control.clearErrorMessage();
        Replayer.control.showMessage(MESSAGE.CLEAR_AB);
    }
    ,
    repeatVideo: function () {
        if (!Replayer.control.timeRangeIsValid()) {
            Replayer.control.showGuildMessage(false);
            return;
        }
        Replayer.control.showGuildMessage(true);
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
        this.initEndValue();
        this.enableRepeatCheckbox(false);
    },
    initEndValue: function () {
        if (isNaN(videoPlayer.duration)) {
            setTimeout(function () {
                console.log("retry after 3 seconds");
                Replayer.control.initEndValue();
            }, 2000);
        } else {
            this.setValueForEndInput(videoPlayer.duration);
        }
    }
    ,
    listenForKey: function () {
        $(window).keydown(function (e) {
            downKeysMap[e.keyCode] = true;
        }).keyup(function (e) {
            var fromPress = downKeysMap[Shift_CODE] && downKeysMap[Z_CODE];
            var toPress = downKeysMap[Shift_CODE] && downKeysMap[X_CODE];
            var repeatPress = downKeysMap[Shift_CODE] && downKeysMap[S_CODE];
            var resetPress = downKeysMap[Shift_CODE] && downKeysMap[C_CODE];
            var replayNowPress = downKeysMap[Shift_CODE] && downKeysMap[D_CODE];
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
            downKeysMap[e.keyCode] = false;
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
        if ($('#repeatMainControl').length) {
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
        element.attr({
            'data-toggle': 'tooltip',
            'data-placement': 'bottom',
            'title': message
        });
    }
};
setTimeout(function () {
    controlObj = Replayer.control;
    Replayer.control.addReplayBar();
}, 1000);

