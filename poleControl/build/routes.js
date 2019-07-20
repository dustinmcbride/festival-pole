"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = _interopRequireDefault(require("./config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class Routes {
  constructor(board) {
    this.board = board;
    this.getState = this.getState.bind(this);
    this.setBrightness = this.setBrightness.bind(this);
  }

  setCurrentLoop(req, res) {
    const loopIndex = _config.default.loops.indexOf(req.params.value.toUpperCase());

    const commandIndex = _config.default.commands.indexOf('SET_CURRENT_LOOP');

    if (loopIndex === -1) {
      res.sendStatus(500);
      return;
    }

    console.log('send to board', `${commandIndex}:${loopIndex}`);
    res.send('state here');
  }

  setBrightness(req, res) {
    const commandIndex = _config.default.commands.indexOf('SET_BRIGHTNESS');

    this.board.setBrightness(req.params.value);
    console.log('send to board', `${commandIndex}:${req.params.value}`);
    res.send('state here');
  }

  getState(req, res) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let state = yield _this.board.getState();
      res.send(state);
    })();
  }

}

exports.default = Routes;