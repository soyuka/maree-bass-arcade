import React from 'react'
import List from './List.js'
import {throttle} from './utils.js'
import GamepadLink from './GamepadLink.js'

export default class Years extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      years: [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019].map((e) => <GamepadLink to={{pathname: '/', search: '?year='+e}} onSelect={this.props.selectYear}>{e}</GamepadLink>),
      len: 8,
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
    return <List list={this.state.years} selected={this.state.selected} itemClassName='nes-container' className='list' />
  }
}
