import config from './config'
import shutdown from './utils/shutdown'

export default class Routes {
  constructor(board) {
    this.board = board;

    this.getState = this.getState.bind(this)
    this.setBrightness = this.setBrightness.bind(this);
  }

  setCurrentLoop (req, res) {
    const loopIndex = config.loops.indexOf(req.params.value.toUpperCase());
    const commandIndex = config.commands.indexOf('SET_CURRENT_LOOP')

    if (loopIndex === -1) {
      res.sendStatus(500);
      return
    }
    console.log('send to board', `${commandIndex}:${loopIndex}` )
    res.send('state here')
  }

  setBrightness (req, res) {
    const commandIndex = config.commands.indexOf('SET_BRIGHTNESS')
    this.board.setBrightness(req.params.value)

    console.log('send to board', `${commandIndex}:${req.params.value}` )
    res.send('state here')
  }

  async getState (req, res) {
    let state = await this.board.getState()
    res.send(state)
  }

  async shutDown (req, res) {
    shutdown(function(error, stdout, stderr){
      res.send({error, stdout, stderr})
    });
  }
}