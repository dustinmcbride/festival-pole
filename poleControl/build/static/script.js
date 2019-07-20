"use strict";

$("#slider").slider({
  range: false,
  animate: "fast",
  max: 255,
  min: 0,
  stop: setBrightness,
  value: 0
});

function setBrightness(event, handle) {
  fetch('set/brightness/' + handle.value);
}

function changeCurrentLoop(a, b, c) {
  fetch('set/current-loop/' + event.target.value);
}

function getState() {
  fetch('get/state').then(function (body) {
    return body.json();
  }).then(results => {
    $("#slider").slider("value", parseInt(results.brightness));
  });
}

function sendCustomCommand() {}