"use strict";

var _express = _interopRequireDefault(require("express"));

var _Logger = _interopRequireDefault(require("./utils/Logger"));

var _routes = _interopRequireDefault(require("./routes"));

var _config = _interopRequireDefault(require("./config"));

var _path = _interopRequireDefault(require("path"));

var _Board = _interopRequireDefault(require("./Board"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const logger = new _Logger.default();
const board = new _Board.default();
const routes = new _routes.default(board);
const app = (0, _express.default)();
app.use('/', _express.default.static(_path.default.join(__dirname, 'static')));
app.get('/set/current-loop/:value', routes.setCurrentLoop);
app.get('/set/brightness/:value', routes.setBrightness);
app.get('/get/state', routes.getState);
app.listen(_config.default.port, () => logger.info(`Pole Control listening on port ${_config.default.port}!`));

const init =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* () {
    logger.info(`Starting....`);
    logger.info(`NODE_ENV=${process.env.NODE_ENV}`);

    try {
      logger.info('Intializing arduino board...');
      yield board.init();
      console.log('Intialized');
    } catch (ex) {
      logger.error('Unable to intialize', ex);
    }
  });

  return function init() {
    return _ref.apply(this, arguments);
  };
}();

init();