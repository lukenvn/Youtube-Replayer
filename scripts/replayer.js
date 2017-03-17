var Replayer = Replayer || {};
var videoPlayer;

var startInput, endInput, startBtn, endBtn, repeatCheckbox;
var timer;
var Z_CODE = 90, X_CODE = 88, C_CODE = 67, S_CODE = 83, Shift_CODE = 16;
var down = {};
Replayer.control = {
    initControlBar: function (controlElement) {
        var repeatMainControl = $("<div>").attr("id", "repeatMainControl").addClass("row");
        repeatMainControl.append(this.initStartInputContainer());
        repeatMainControl.append(this.initEndInputContainer());
        repeatMainControl.append(this.initRepeatCheckBox());
        controlElement.append(repeatMainControl);
        this.listenForMainControl();
    },
    initStartInputContainer: function () {
        var startMainControl = $('<div>').addClass("one-line");
        var childMainControl = $('<div>').addClass("input-group");
        startInput = $("<input>").attr('id', 'startInput').addClass("form-control input-text");
        var spanGroup = $("<span>").addClass("input-group-btn");
        startBtn = $("<button>").attr('id', 'startBtn').addClass("btn btn-default").text("From:");
        startBtn.attr('data-toggle', 'tooltip').attr('data-placement', 'bottom').attr('title',  "Press 'Shift' + 'Z' keys instead");
        spanGroup.append(startBtn);
        childMainControl.append(spanGroup);
        childMainControl.append(startInput);
        startMainControl.append(childMainControl);
        return startMainControl;
    },
    initEndInputContainer: function () {
        var endMainControl = $('<div>').addClass("one-line");
        var childMainControl = $('<div>').addClass("input-group");
        endInput = $("<input>").attr('id', 'startInput').addClass("form-control input-text");
        var spanGroup = $("<span>").addClass("input-group-btn");
        endBtn = $("<button>").addClass("btn btn-default").text("To:");
        endBtn.attr('data-toggle', 'tooltip').attr('data-placement', 'bottom').attr('title', "Press 'Shift' + 'X' keys instead");
        spanGroup.append(endBtn);
        childMainControl.append(spanGroup);
        childMainControl.append(endInput);
        endMainControl.append(childMainControl);
        return endMainControl;
    },
    initRepeatCheckBox: function () {
        var checkBoxContainer = $('<div>').attr('id', 'checkboxContainer');
        var label = $("<label>");
        repeatCheckbox = $("<input type='checkbox'>")
            .attr('check', 'false').attr("id", "myCheckBox")
            .addClass('checkbox');
        checkBoxContainer.attr('data-toggle', 'tooltip').attr('data-placement', 'bottom').attr('title', "Press 'Shift' + 'S' keys instead");
        var txt = $("<div>").addClass('text').text("Auto Replay");
        label.addClass('replay-container').append(repeatCheckbox, txt);
        checkBoxContainer.append(label);
        return checkBoxContainer;
    },
    isRepeatEnable: function () {
        return repeatCheckbox.is(':checked');
    },
    setValueForStartInput: function (value) {
        startInput.val(secondsToString(value));
    },
    setValueForEndInput: function (value) {
        endInput.val(secondsToString(value));
    },
    enableRepeatCheckbox: function (value) {
        repeatCheckbox.attr('checked', value);
    },
    repeatVideo: function () {
        timer = setInterval(function () {
            console.log("loop");
            if (Replayer.control.isRepeatEnable()) {
                var currentTime = videoPlayer.currentTime;
                var endTime = stringToSeconds(endInput.val());
                if (currentTime >= (endTime-1)) {
                    Replayer.control.repeat();
                }
            } else {
                Replayer.control.clearRepeater();
            }
        }, 500);

    },
    repeat: function () {
        videoPlayer.currentTime = stringToSeconds(startInput.val());
        videoPlayer.play();
    },
    clearRepeater: function () {
        clearInterval(timer);

    },
    reInitValue: function () {
        this.setValueForStartInput(0);
        if (isNaN(videoPlayer.duration)) {
            console.log("isNaN");
            setTimeout(function () {
                console.log("after 3 seconds");
                Replayer.control.setValueForEndInput(videoPlayer.duration);
            }, 3000);
        } else {
            this.setValueForEndInput(videoPlayer.duration);
        }
        this.enableRepeatCheckbox(false);
    }
    ,
    initListener: function () {
        this.listenForKey();
    },
    listenForKey: function () {
        $(window).keydown(function (e) {
            down[e.keyCode] = true;
        }).keyup(function (e) {
            var fromPress = down[Shift_CODE] && down[Z_CODE];
            var toPress = down[Shift_CODE] && down[X_CODE];
            var repeatPress = down[Shift_CODE] && down[S_CODE];
            var resetPress = down[Shift_CODE] && down[C_CODE];

            if (fromPress) {
                startBtn.click();
                //$("#startBtn").click();
            } else if (toPress) {
                endBtn.click();
            } else if (repeatPress) {
                repeatCheckbox.click();
            } else if (resetPress) {
                Replayer.control.clearRepeater();
                Replayer.control.reInitValue();
            }
            down[e.keyCode] = false;
        });
    },
    listenForMainControl: function () {
        startBtn.click(function () {
            Replayer.control.setValueForStartInput(videoPlayer.currentTime);
        });
        endBtn.click(function () {
            Replayer.control.setValueForEndInput(videoPlayer.currentTime);
            Replayer.control.enableRepeatCheckbox(true);
            Replayer.control.repeatVideo();
        });
        repeatCheckbox.change(function () {
            if (endInput.val()) {
                if (Replayer.control.isRepeatEnable()) {
                    Replayer.control.repeatVideo();
                } else {
                    clearInterval(timer);
                }
            }
        });
    }
};

function stringToSeconds(time) {
    var smh = time.split(":"), seconds = 0;
    for (var i = 0; i < smh.length; i++) {
        seconds += smh[i] * Math.pow(60, smh.length - 1 - i);
    }
    return seconds;
}

function secondsToString(time) {
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
}
function init() {
    var videoControls = $('#watch-header');
    Replayer.control.initControlBar(videoControls);
    Replayer.control.reInitValue();

}
setTimeout(function () {
    videoPlayer = document.getElementsByClassName("html5-main-video")[0];
    videoPlayer.addEventListener('loadedmetadata', function (e) {
        console.log("load video");
        if (!$('#repeatMainControl').length) {
            init();
        }
    });
    init();
    Replayer.control.initListener();

    //var test =$('#test');
    //Replayer.control.initControlBar(test);
}, 1000);

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});