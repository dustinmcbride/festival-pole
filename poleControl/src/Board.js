const SerialPort = require('serialport')
const Delimiter = require('@serialport/parser-delimiter')
import config from './config';

import Logger from './utils/Logger';

const timeout = ms => new Promise(res => setTimeout(res, ms))

const logger = new Logger();

class Board {
  constructor() {
    this.board = null;
    this.state = null;

    this.init = this.init.bind(this);
    this.listener = this.listener.bind(this);
    this.setBrightness = this.setBrightness.bind(this);
    this.sendCommand = this.sendCommand.bind(this);
  }

  async init() {
    logger.info('Intializing Arduino board...')

    while (!this.board) {

      let allSerialPorts;

      try {
        allSerialPorts = await SerialPort.list()
      } catch (ex) {
        logger.error('Cannot get system serial ports, board init failed')
        return ex;
      }

      let arduinoPort = allSerialPorts.filter(port => {
        if (port.manufacturer) {
          return port.manufacturer.toLowerCase().includes('arduino')
        }
      })

      // tODO try/cathc
      if (arduinoPort.length === 0) {
        logger.error('Arduino board not connected')
        await timeout(1000)
      } else {
        logger.info('Board found waiting for data')
        let port = arduinoPort[0]
        this.board = new SerialPort(port.comName);
      }
    }

    this.listener();
    await timeout(4000);
    this.board.write('2:0')

    while (!this.state) {
      await timeout(1000);
    }
    return true
  }

  sendCommand(command, value) {
    const commandIndex = config.commands.indexOf(command);
    this.board.write(`${commandIndex}:${value}`);
  }

  setBrightness(value) {
    this.sendCommand('SET_BRIGHTNESS', value);
  }

  listener() {
    const reader = this.board.pipe(new Delimiter({
      delimiter: '\r\n'
    }))

    reader.on('close', () => {
      console.log('closed')
    })

    reader.on('error', () => {
      console.log('error')
    })

    reader.on('data', (data) => {
      console.log('data:', data.toString());
      let parsedData = this.parseData(data.toString())
      if (parsedData) {
        this.state = parsedData;
      }
    })
  }

  updateState() {
    this.sendCommand('SET_BRIGHTNESS', value);
  }

  parseData(data) {
    let results;
    if (data.substring(0, 6) === "@DATA=") {
      results = {};
      const message = data.substring(6, data.length)
      let dataArray = message.split('|')
      for (let i = 0; i < dataArray.length; i++) {
        let splitElement = dataArray[i].split(':');
        results[splitElement[0]] = splitElement[1];
      }
    }
    return results;
  }
}

export default Board;