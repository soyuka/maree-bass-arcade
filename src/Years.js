import React from 'react'
import List from './List.js'
import {throttle} from './utils.js'
import GamepadLink from './GamepadLink.js'

export default class Years extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      len: 8,
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
    const todayYear = (new Date()).getFullYear()
    const startedIn = 2012

    return <List focused={this.state.focused} itemClassName='nes-container' className='list'>
      {Array.from({length: todayYear - startedIn}).map((_, i) => <GamepadLink key={i + startedIn + 1} to={{pathname: '/release/year/'+(i+startedIn + 1)}} onSelect={this.props.selectYear}>{i+startedIn + 1}</GamepadLink>)}
    </List>
  }
}
