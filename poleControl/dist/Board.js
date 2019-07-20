"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("./config"));

var _Logger = _interopRequireDefault(require("./utils/Logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const SerialPort = require('serialport');

const Delimiter = require('@serialport/parser-delimiter');

const timeout = ms => new Promise(res => setTimeout(res, ms));

const logger = new _Logger.default();

class Board {
  constructor() {
    this.board = null;
    this.state = null;
    this.init = this.init.bind(this);
    this.listener = this.listener.bind(this);
    this.setBrightness = this.setBrightness.bind(this);
    this.sendCommand = this.sendCommand.bind(this);
  }

  init() {
    var _this = this;

    return _asyncToGenerator(function* () {
      logger.info('Intializing Arduino board...');

      while (!_this.board) {
        let allSerialPorts;

        try {
          allSerialPorts = yield SerialPort.list();
        } catch (ex) {
          logger.error('Cannot get system serial ports, board init failed');
          return ex;
        }

        let arduinoPort = allSerialPorts.filter(port => {
          if (port.manufacturer) {
            return port.manufacturer.toLowerCase().includes('arduino');
          }
        }); // tODO try/cathc

        if (arduinoPort.length === 0) {
          logger.error('Arduino board not connected');
          yield timeout(1000);
        } else {
          logger.info('Board found waiting for data');
          let port = arduinoPort[0];
          _this.board = new SerialPort(port.comName);
        }
      }

      _this.listener();

      yield timeout(4000);

      _this.board.write('2:0');

      while (!_this.state) {
        yield timeout(1000);
      }

      return true;
    })();
  }

  sendCommand(command, value) {
    const commandIndex = _config.default.commands.indexOf(command);

    this.board.write(`${commandIndex}:${value}`);
  }

  setBrightness(value) {
    this.sendCommand('SET_BRIGHTNESS', value);
  }

  listener() {
    const reader = this.board.pipe(new Delimiter({
      delimiter: '\r\n'
    }));
    reader.on('close', () => {
      console.log('closed');
    });
    reader.on('error', () => {
      console.log('error');
    });
    reader.on('data', data => {
      console.log('data:', data.toString());
      let parsedData = this.parseData(data.toString());

      if (parsedData) {
        this.state = parsedData;
      }
    });
  }

  updateState() {
    this.sendCommand('SET_BRIGHTNESS', value);
  }

  parseData(data) {
    let results;

    if (data.substring(0, 6) === "@DATA=") {
      results = {};
      const message = data.substring(6, data.length);
      let dataArray = message.split('|');

      for (let i = 0; i < dataArray.length; i++) {
        let splitElement = dataArray[i].split(':');
        results[splitElement[0]] = splitElement[1];
      }
    }

    return results;
  }

}

var _default = Board;
exports.default = _default;