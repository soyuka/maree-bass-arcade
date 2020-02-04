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

const ReleasesWithRouter = withRouter(Releases)
const PicksWithRouter = withRouter(Picks)

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.history = props.history
    this.yearSelected = 0
    this.artistSelected = 0
    this.state = {
      selected: []
    }
  }

  selectYear(selected) {
    this.yearSelected = selected
  }

  selectArtist(selected) {
    this.artistSelected = selected
  }

  select(item) {
    if (this.state.selected.find(e => e.id === item.id)) return

    const selected = [...this.state.selected]
    selected.push(item)

    this.setState({selected})
  }

  componentDidMount() {
    this.subscription = window.joypad.on('button_press', (e) => {
      const { buttonName } = e.detail

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
            <Route path="/years">
              <Years selected={this.yearSelected} selectYear={this.selectYear.bind(this)} />
            </Route>
            <Route path="/artists">
              <Artists selected={this.artistSelected} selectArtist={this.selectArtist.bind(this)} />
            </Route>
            <Route path="/picks"><PicksWithRouter selected={this.state.selected} /></Route>
            <Route path="/credits">Credits</Route>
            <Route path="/" exact><ReleasesWithRouter onSelect={this.select.bind(this)} /></Route>
          </Switch>
        </section>
        <footer className="footer">
          <NavLink to="/" exact className="col nes-btn" activeClassName="is-disabled">Releases (1)</NavLink>
          <NavLink to="/artists" className="col nes-btn" activeClassName="is-disabled">Artists (2)</NavLink>
          <NavLink to="/years" className="col nes-btn" activeClassName="is-disabled">Year (3)</NavLink>
          <NavLink to="/picks" className="col nes-btn" activeClassName="is-disabled">{this.state.selected.length}<i className="nes-icon is-small coin"></i> (Select)</NavLink>
        </footer>
      </div>
  }
}
