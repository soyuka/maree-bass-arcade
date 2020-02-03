import React from 'react'
import Years from './Years.js'
import Artists from './Artists.js'
import Releases from './Releases.js'
import {
  Switch,
  Route,
  NavLink
} from "react-router-dom";
import './Game.scss'

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.history = props.history
  }

  componentDidMount() {
    this.subscription = window.joypad.on('button_press', (e) => {
      const { buttonName } = e.detail

      if (buttonName === 'button_0') {
        this.history.push('/')
      }

      if (buttonName === 'button_1') {
        this.history.push('/artists')
      }

      if (buttonName === 'button_2') {
        this.history.push('/years')
      }

      if (buttonName === 'button_3') {
        this.history.push('/credits')
      }
    })
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    return <div className="game">
        <section className="content">
          <Switch>
            <Route path="/years" component={Years} />
            <Route path="/artists" component={Artists} />
            <Route path="/credits"></Route>
            <Route path="/" exact component={Releases} />
          </Switch>
        </section>
        <footer className="footer">
          <NavLink to="/" exact className="col nes-btn" activeClassName="is-disabled">Releases (1)</NavLink>
          <NavLink to="/artists" className="col nes-btn" activeClassName="is-disabled">Artists (2)</NavLink>
          <NavLink to="/years" className="col nes-btn" activeClassName="is-disabled">Year (3)</NavLink>
          <NavLink to="/credits" className="col nes-btn" activeClassName="is-disabled">Credits (4)</NavLink>
          <NavLink to="/picks" className="col nes-btn" activeClassName="is-disabled">0<i className="nes-icon is-small coin"></i> (Select)</NavLink>
        </footer>
      </div>
  }
}
