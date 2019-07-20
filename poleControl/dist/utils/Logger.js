"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Logger {
  constructor() {}

  info(msg) {
    console.log(msg);
  }

  error(msg) {
    console.error(msg);
  }

}

exports.default = Logger;