"use strict"; // prevent lazy programming in JavaScript :)

// URL for dataFile
var URL = "Script/Data.json";

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
};
const addRow = (id, data) => {
  $("#data-table").prepend(`
  <tr>
    <td>${id}</td>
    <td>${data.date.toLocaleTimeString()}</td>
    <td>${data.value / 1000}</td>
  </tr>`);
};

const dataArray = [];
function deployValues(values) {
  if (values[0]) {
    $("#status_icon").removeClass("status-0");
    $("#status_icon").addClass("status-1");
  } else {
    $("#status_icon").removeClass("status-1");
    $("#status_icon").addClass("status-0");
  }

  const date = new Date();

  if (dataArray.length === 0) {
    dataArray.push({ date: date, value: values[1] });
    addRow(dataArray.length, { date: date, value: values[1] });
  }

  if (date.getTime() - dataArray[dataArray.length - 1].date.getTime() > 1000) {
    dataArray.push({ date: date, value: values[1] });
    addRow(dataArray.length, { date: date, value: values[1] });
  }
  const percent = Math.round(values[1] / 10) / 100;
  $("#img-loading").height(100 - percent + "%");

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
  setTimeout(() => {
    S7Framework.readData(URL, "init read data", deployValues);
  }, 100);
}
