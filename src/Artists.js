import React from 'react'
import List from './List.js'
import {throttle} from './utils.js'
import database from './database.json'
import GamepadLink from './GamepadLink.js'

const artists = database.filter((e) => e.download !== null).map((e) => ({name: e.artist, search: e.artist_search})).filter((e) => e.name !== null).filter((v, i, self) => self.findIndex((e) => v.name === e.name) === i)

export default class Artists extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      len: artists.length,
      focused: props.focused || 0
    }
  }

  componentDidMount() {
    const eventListener = (e) => {
      const { directionOfMovement } = e.detail
      const focused = this.state.focused

      if (directionOfMovement === 'bottom') {
        this.setState({focused: focused === this.state.len - 1 ? 0 : focused + 1})
      }

      if (directionOfMovement === 'top') {
        this.setState({focused: focused === 0 ? this.state.len - 1: focused - 1})
      }
    }

    this.subscription = window.joypad.on('axis_move', throttle(eventListener))
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    return <List list={this.state.list} focused={this.state.focused} itemClassName='nes-container' className='list'>
      {artists.map((e) => <GamepadLink key={e.search} to={{pathname: '/release/artist/' + e.search}} onSelect={this.props.selectArtist}>{e.name}</GamepadLink>)}
    </List>
  }
}
