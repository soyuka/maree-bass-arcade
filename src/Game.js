import React from 'react'
import Years from './Years.js'
import Artists from './Artists.js'
import Releases from './Releases.js'
import Picks from './Picks.js'
import Credits from './Credits.js'
import {
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import './Game.scss'
import {throttle} from './utils.js'
import demo from './demo.js'

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
    this.yearFocused = 0
    this.artistFocused = 0
    this.state = {
      selected: []
    }
    this.subscriptions = []
    this.demoTimeout = null
    this.isDemoRunning = false
    // 5 min
    this.demoStartsIn = 300000
    // this.demoStartsIn = 2000
  }

  selectYear(focused) {
    this.yearFocused = focused
  }

  selectArtist(focused) {
    this.artistFocused = focused
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

  resetState() {
    this.setState({
      selected: []
    })

    this.yearFocused = 0
    this.artistFocused = 0
    this.history.push('/')
  }

  startDemo() {
    if (this.isDemoRunning) {
      console.log('should not happend')
      return
    }

    console.log('start demo')
    this.isDemoRunning = true
    document.getElementById('root').classList.add('demo')
    demo(() => this.isDemoRunning, () => {
      setTimeout(() => {
        //end demo, restart timer
        this.stopDemo()
      }, 50000)
    })
  }

  resetDemoTimeout() {
    if (this.demoTimeout) clearTimeout(this.demoTimeout)
    this.demoTimeout = setTimeout(() => {
      this.startDemo()
    }, this.demoStartsIn)
  }

  stopDemo() {
    console.log('stop demo')
    if (this.isDemoRunning === true) {
      document.getElementById('root').classList.remove('demo')
      this.isDemoRunning = false
      this.resetState()
    }

    this.resetDemoTimeout()
  }

  componentDidMount() {
    this.subscriptions[0] = window.joypad.on('button_press', (e) => {
      const { buttonName, demo } = e.detail

      if (!demo) this.stopDemo()

      if (this.moveKonami(buttonName)) {
        return
      }

      if (this.props.location.pathname === '/picks') {
        this.resetState()
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
      const { directionOfMovement, demo } = event.detail
      if (!demo) this.stopDemo()
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

    this.resetDemoTimeout()
  }

  componentWillUnmount() {
    this.subscriptions.map(sub => sub.unsubscribe())
    this.stopDemo()
    clearTimeout(this.demoTimeout)
  }

  render() {
    return <div className="game">
        <section className="content">
          <Switch>
            <Route path="/years" render={() => <Years focused={this.yearFocused} selectYear={this.selectYear.bind(this)} />} />
            <Route path="/artists" render={() => <Artists focused={this.artistFocused} selectArtist={this.selectArtist.bind(this)} />} />
            <Route path="/picks" render={(routerProps) => <Picks selected={this.state.selected} {...routerProps} />} />
            <Route path="/credits" render={() => <Credits />} />
            <Route path="/release/artist/:artist" render={(routeProps) => <Releases onSelect={this.select.bind(this)} selected={this.state.selected} {...routeProps} />} />
            <Route path="/release/year/:year" render={(routeProps) => <Releases onSelect={this.select.bind(this)} selected={this.state.selected} {...routeProps} />} />
            <Route path="/" exact render={(routeProps) => <Releases onSelect={this.select.bind(this)} selected={this.state.selected} {...routeProps} />} />
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
