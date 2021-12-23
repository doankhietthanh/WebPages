"use strict"; // prevent lazy programming in JavaScript :)

// URL for dataFile
var URL = "Script/OverView.json";

// every time if the DOM refresh
$(document).ready(function () {
  $.init();
});

$.init = function () {
  S7Framework.initialize("1500", "");

  S7Framework.readData(URL, "init read data", deployValues);

  $("#openvalve").click(function () {
    var data = '"web".valve=1';
    S7Framework.writeData(URL, data, "V_START");
  });

  $("#closevalve").click(function () {
    var data = '"web".valve=0';
    S7Framework.writeData(URL, data, "V_STOP");
  });

  $("#mode").change((e) => {
    if ($("#mode").is(":checked")) {
      var data = '"web".manual=1';
      S7Framework.writeData(URL, data, "V_STOP");

      $("#openvalve").prop("disabled", false);
      $("#closevalve").prop("disabled", false);
    } else {
      var data = '"web".manual=0';
      S7Framework.writeData(URL, data, "V_STOP");

      $("#openvalve").prop("disabled", true);
      $("#closevalve").prop("disabled", true);
    }
  });
};

function deployValues(values) {
  if (values[0]) {
    $("#status_icon").removeClass("status-0");
    $("#status_icon").addClass("status-1");
    $("#img-value").prop("checked", true);
  } else {
    $("#status_icon").removeClass("status-1");
    $("#status_icon").addClass("status-0");
    $("#img-value").prop("checked", false);
  }
  if (values[1]) {
    $("#mode_name").text("MODE: MANUAL");
    $("#mode").prop("checked", true);
  } else {
    $("#mode_name").text("MODE: AUTO");
    $("#mode").prop("checked", false);
  }
  if (values[3] / 1000 < 0.01) {
    $("#tank_level_").text(0);
  } else {
    $("#tank_level_").text(values[3] / 1000);
  }
  $("#set_point_").text(values[2] / 1000);

  const percent = Math.round(values[3] / 10) / 100;
  $("#img-loading").height(100 - percent + "%");

  if (values[4]) {
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

  setTimeout(() => {
    S7Framework.readData(URL, "init read data", deployValues);
  }, 100);
}
