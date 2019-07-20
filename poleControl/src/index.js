import express from 'express';
import Logger from './utils/Logger';
import Routes from './routes'
import config from './config'
import path from 'path';
import Board from './Board'

const logger = new Logger();
const board = new Board();
const routes = new Routes(board)

const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.get('/set/current-loop/:value', routes.setCurrentLoop)
app.get('/set/brightness/:value', routes.setBrightness)
app.get('/get/state', routes.getState)
app.listen(config.port, () => logger.info(`Pole Control listening on port ${config.port}!`))

const init = async () => {

  logger.info(`Starting....`)
  logger.info(`NODE_ENV=${process.env.NODE_ENV}`)

  try {
    logger.info('Intializing arduino board...')
    await board.init();
    console.log('Intialized')

  } catch (ex) {
    logger.error('Unable to intialize', ex)
  }

}

init()