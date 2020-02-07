import React from 'react'
import Years from './Years.js'
import Artists from './Artists.js'
import Releases from './Releases.js'
import Picks from './Picks.js'
import {
  Switch,
  Route,
  NavLink,
  withRouter
} from "react-router-dom";
import './Game.scss'
import {throttle} from './utils.js'

const ReleasesWithRouter = withRouter(Releases)
const PicksWithRouter = withRouter(Picks)

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.savedKonamiSequence = []
    this.konamiSequence = ['top', 'top', 'bottom', 'bottom', 'left', 'right', 'left', 'right', 'button_1', 'button_0']
    this.keyboardToJoypad = {
      ArrowUp: ['axis_move', 'top'],
      ArrowDown: ['axis_move', 'bottom'],
      ArrowLeft: ['axis_move', 'left'],
      ArrowRight: ['axis_move', 'right'],
      1: ['button_press', 'button_0'],
      2: ['button_press', 'button_1'],
      3: ['button_press', 'button_2'],
      4: ['button_press', 'button_3'],
      Enter: ['button_press', 'button_8'],
      Backspace: ['button_press', 'button_9'],
    }

    this.history = props.history
    this.yearSelected = 0
    this.artistSelected = 0
    this.state = {
      selected: []
    }
    this.subscriptions = []
  }

  selectYear(selected) {
    this.yearSelected = selected
  }

  selectArtist(selected) {
    this.artistSelected = selected
  }

  select(item) {
    const selected = [...this.state.selected]
    const index = selected.findIndex(e => e.id === item.id)

    if (index !== -1) {
      selected.splice(index, 1)
    } else {
      selected.push(item)
    }

    this.setState({selected})
  }

  moveKonami(button) {
    if (this.savedKonamiSequence.length === 0 && button === 'top') {
      this.savedKonamiSequence.push(button)
      return
    }

    if (this.konamiSequence[this.savedKonamiSequence.length] !== button) {
      this.savedKonamiSequence = []
      return
    }

    this.savedKonamiSequence.push(button)

    if (this.savedKonamiSequence.length === this.konamiSequence.length) {
      this.history.push('/credits')
      return true
    }
  }

  componentDidMount() {
    this.subscriptions[0] = window.joypad.on('button_press', (e) => {
      const { buttonName } = e.detail

      if (this.moveKonami(buttonName)) {
        return
      }

      if (this.props.location.pathname === '/picks') {
        this.setState({
          selected: []
        })

        this.yearSelected = 0
        this.artistSelected = 0

        this.history.push('/')
        return
      }

      if (buttonName === 'button_0') {
        this.history.push('/')
      }

      if (buttonName === 'button_1') {
        this.history.push('/artists')
      }

      if (buttonName === 'button_2') {
        this.history.push('/years')
      }

      // if (buttonName === 'button_3') {
        // this.history.push('/credits')
      // }
    })

    this.subscriptions[1] = window.joypad.on('axis_move', throttle((event) => {
      const { directionOfMovement } = event.detail
      this.moveKonami(directionOfMovement)
    }))

    // Allow keyboard
    this.subscriptions[2] = (() => {
      const ee = (event) => {
        if (!this.keyboardToJoypad[event.key]) return
        const [joypadEvent, detail] = this.keyboardToJoypad[event.key]

        window.joypad.emit(joypadEvent, {detail: {[joypadEvent === 'axis_move' ? 'directionOfMovement' : 'buttonName']: detail}})
      }

      window.addEventListener('keyup', ee)

      return {
        unsubscribe: () => {
          window.removeEventListener('keyup', ee)
        }
      }
    })()
  }

  componentWillUnmount() {
    this.subscriptions.map(sub => sub.unsubscribe())
  }

  render() {
    return <div className="game">
        <section className="content">
          <Switch>
            <Route path="/years">
              <Years selected={this.yearSelected} selectYear={this.selectYear.bind(this)} />
            </Route>
            <Route path="/artists">
              <Artists selected={this.artistSelected} selectArtist={this.selectArtist.bind(this)} />
            </Route>
            <Route path="/picks"><PicksWithRouter selected={this.state.selected} /></Route>
            <Route path="/credits">Credits</Route>
            <Route path="/" exact><ReleasesWithRouter onSelect={this.select.bind(this)} selected={this.selected} /></Route>
          </Switch>
        </section>
        <footer className="footer">
          <NavLink to="/" exact className="col nes-btn" activeClassName="is-disabled">Releases</NavLink>
          <NavLink to="/artists" className="col nes-btn" activeClassName="is-disabled">Artists</NavLink>
          <NavLink to="/years" className="col nes-btn" activeClassName="is-disabled">Year</NavLink>
          <NavLink to="/picks" className="col nes-btn" activeClassName="is-disabled">{this.state.selected.length}<i className="coin-rotate"></i></NavLink>
        </footer>
      </div>
  }
}
