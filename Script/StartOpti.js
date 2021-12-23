"use strict"; // prevent lazy programming in JavaScript :)

// URL for dataFile
var URL = "Script/StartOpti.json";

// every time if the DOM refresh
$(document).ready(function () {
  $.init();
});

$.init = function () {
  S7Framework.initialize("1500", "");

  S7Framework.readData(URL, "init read data", deployValues);

  $("#start").click(function () {
    var data = '"web".start=1' + "&" + '"web".stop=0';
    S7Framework.writeData(URL, data, "START");
  });

  $("#stop").click(function () {
    var data = '"web".start=0' + "&" + '"web".stop=1';
    S7Framework.writeData(URL, data, "STOP");
  });

  $("#setpoint_value_btn").click(function () {
    const val = $("#setpoint_value").val();
    if (val > 100 || val < 0) {
      alert("SetPoint of the water tank between 0 and 100!");
    } else {
      var data = '"web".setPointValue=' + val;
      S7Framework.writeData(URL, data, "SETPOINT");
      $("#setPoint").text(val);
    }
  });
};

function deployValues(values) {
  if (values[0]) {
    $("#status_icon").removeClass("status-0");
    $("#status_icon").addClass("status-1");
  } else {
    $("#status_icon").removeClass("status-1");
    $("#status_icon").addClass("status-0");
  }
  const percent = Math.round(values[1] / 10) / 100;
  $("#img-loading").height(100 - percent + "%");
  $("#process").width(percent + "%");
  $("#process_percent").text(percent + "%");

  if (values[0]) {
    if (percent > 90) {
      $("#_alarm").show();
      $("#_alarm p").text("The level is too high! Please check your system");
    } else if (percent < 20) {
      $("#_alarm").show();
      $("#_alarm p").text("The level is too low! Please check your system");
    } else {
      $("#_alarm").hide();
    }
  } else {
    $("#_alarm").hide();
  }

  const setPoint = values[2] / 1000;

  $("#setPoint").text(setPoint);

  setTimeout(() => {
    S7Framework.readData(URL, "init read data", deployValues);
  }, 100);
}
