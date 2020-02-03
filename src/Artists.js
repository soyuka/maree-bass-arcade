import React from 'react'
import List from './List.js'
import {throttle} from './utils.js'
import artists from './artists.json'
import { Link } from "react-router-dom";
export default class Artists extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      list: artists.map((e) => <Link to={{pathname: '/', search: '?artist='+e.search}}>{e.name}</Link>),
      len: artists.length,
      selected: 0
    }
    this.subscriptions = []
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

    this.subscriptions[0] = window.joypad.on('axis_move', throttle(eventListener))

    this.subscriptions[1] = window.joypad.on('button_press', (e) => {
      const { buttonName } = e.detail

      if (buttonName === 'button_8') {
        const activeLink = document.querySelector('.list .is-dark a')
        activeLink.click()
      }
    })
  }

  componentWillUnmount() {
    this.subscriptions[0].unsubscribe()
    this.subscriptions[1].unsubscribe()
  }

  render() {
    return <List list={this.state.list} selected={this.state.selected} itemClassName='nes-container' className='list' />
  }
}
