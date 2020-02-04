import React from 'react'
import List from './List.js'
import {throttle} from './utils.js'
import artists from './artists.json'
import GamepadLink from './GamepadLink.js'

export default class Artists extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      list: artists.map((e) => <GamepadLink to={{pathname: '/', search: '?artist='+e.search}} onSelect={this.props.selectArtist}>{e.name}</GamepadLink>),
      len: artists.length,
      selected: props.selected || 0
    }
  }

  componentDidMount() {
    const eventListener = (e) => {
      const { directionOfMovement } = e.detail
      const selected = this.state.selected

      if (directionOfMovement === 'bottom') {
        this.setState({selected: selected === this.state.len - 1 ? 0 : selected + 1})
      }

      if (directionOfMovement === 'top') {
        this.setState({selected: selected === 0 ? this.state.len - 1: selected - 1})
      }
    }

    this.subscription = window.joypad.on('axis_move', throttle(eventListener))
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    return <List list={this.state.list} selected={this.state.selected} itemClassName='nes-container' className='list' />
  }
}
