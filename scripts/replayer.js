var Replayer = {};
var videoPlayer;

var startInput, endInput, startBtn, endBtn, repeatCheckbox;
var timer;
Replayer.control = {
    initControlBar: function (controlElement) {
        var repeatMainControl = $("<div>").attr("id", "repeatMainControl").addClass("row");
        repeatMainControl.append(this.initStartInputContainer());
        repeatMainControl.append(this.initEndInputContainer());
        repeatMainControl.append(this.initRepeatCheckBox());
        controlElement.append(repeatMainControl);
    },
    initStartInputContainer: function () {
        var startMainControl = $('<div>').addClass("one-line");
        var childMainControl = $('<div>').addClass("input-group");
        startInput = $("<input>").attr('id', 'startInput').addClass("form-control input-text");
        var spanGroup = $("<span>").addClass("input-group-btn");
        startBtn = $("<button>").addClass("btn btn-default").text("From:");
        startBtn.click(function () {
            var currentTime = videoPlayer.currentTime;
            startInput.val(secondsToString(currentTime));
        });
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
        endBtn.click(function () {
            var currentTime = videoPlayer.currentTime;
            endInput.val(secondsToString(currentTime));
            repeatCheckbox.attr('checked', true);
            Replayer.control.repeatVideo();
        });
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
        var txt = $("<div>").addClass('text').text("Auto Replay");
        label.addClass('replay-container').append(repeatCheckbox, txt);
        repeatCheckbox.change(function () {
            if (endInput.val()) {
                if (Replayer.control.isRepeatEnable()) {
                    Replayer.control.repeatVideo();
                } else {
                    clearInterval(timer);
                }
            }
        });
        checkBoxContainer.append(label);
        return checkBoxContainer;
    }
    ,
    isRepeatEnable: function () {
        return repeatCheckbox.is(':checked');
    },
    repeatVideo: function () {
        Replayer.control.repeat();
        timer = setInterval(function () {
            if (Replayer.control.isRepeatEnable()) {
                var currentTime = videoPlayer.currentTime;
                var endTime = stringToSeconds(endInput.val());
                if (currentTime > endTime) {
                    Replayer.control.repeat();
                }
            } else {
                Replayer.control.clearRepeater();
            }
        }, 500);

    }, repeat: function () {
        videoPlayer.currentTime = stringToSeconds(startInput.val());
        videoPlayer.play();
    },
    clearRepeater: function () {
        clearInterval(timer);
        startInput.val(secondsToString(0));
        endInput.val(secondsToString(videoPlayer.duration));
        repeatCheckbox.attr('checked', false);
    },
    initListener: function () {
        $(window).keypress(function (e) {
            var key = e.which;
            console.log("press " + key);
            switch (key) {
                case 122:
                    repeatCheckbox.click();
                    break;
                case 120:
                    startBtn.click();
                    break;
                case 99:
                    endBtn.click();
                    break;
                case 115:
                    Replayer.control.clearRepeater();
                    break;
            }

        });

    },


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
setTimeout(function () {
    var videoControls = $('#watch-header');
    videoPlayer = document.getElementsByClassName("html5-main-video")[0];
    Replayer.control.initControlBar(videoControls);
    Replayer.control.clearRepeater();
    Replayer.control.initListener();


    //var test =$('#test');
    //Replayer.control.initControlBar(test);
}, 1000);
