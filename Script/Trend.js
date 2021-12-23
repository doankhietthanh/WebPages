"use strict"; // prevent lazy programming in JavaScript :)

// URL for dataFile
var URL = "Script/Data.json";
// every time if the DOM refresh
$(document).ready(function () {
  $.init();
});
let myChart;

function addData(chart, label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function removeData(chart) {
  chart.data.labels.shift();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.shift();
  });
  chart.update();
}

$.init = function () {
  S7Framework.initialize("1500", "");

  S7Framework.readData(URL, "init read data", deployValues);

  const ctx = document.getElementById("myChart").getContext("2d");
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"],
      datasets: [
        {
          label: "Process",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

let temp = 0;
function deployValues(values) {
  if (values[0]) {
    $("#status_icon").removeClass("status-0");
    $("#status_icon").addClass("status-1");
  } else {
    $("#status_icon").removeClass("status-1");
    $("#status_icon").addClass("status-0");
  }
  const date = new Date();

  if (temp === 0) {
    addData(myChart, date.toLocaleTimeString(), values[1] / 1000);
    removeData(myChart);
    temp = date.getTime();
  }

  if (date.getTime() - temp > 1000) {
    addData(myChart, date.toLocaleTimeString(), values[1] / 1000);
    removeData(myChart);
    temp = date.getTime();
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
