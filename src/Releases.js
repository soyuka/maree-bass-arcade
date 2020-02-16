import React from 'react'
import List from './List.js'
import PixelatedImg from './PixelatedImg.js'
import {throttle, normalize, getColumnNumber} from './utils.js'
import database from './database.json'
import './Releases.scss'

// skip things I can't download
const releases = database.filter((e) => e.download)

function ReleaseItem({src, alt, selected}) {
  return <div className={'coin-container ' + (selected ? ' is-selected' : '')}><i className='coin-rotate'></i><PixelatedImg src={src} alt={alt} resolution='4' /></div>
}

export default class Releases extends React.Component {
  constructor(props) {
    super(props)
    this.imagesLoaded = 0
    this.subscriptions = []

    this.state = {
      collection: [],
      len: 0,
      focused: 0
    }
  }

  initCollection() {
    let collection = releases
    const search = this.props.match.params

    if (search.artist) {
      collection = collection.filter((e) => normalize(e.title).includes(normalize(search.artist)))
    }

    if (search.year) {
      collection = collection.filter((e) => e.year === search.year)
    }

    this.setState({collection, len: collection.length})
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.path !== prevProps.match.path) {
      this.initCollection()
    }
  }

  componentDidMount() {
    const eventListener = (e) => {
      const { directionOfMovement } = e.detail
      const focused = this.state.focused
      if (!document.querySelector('.release-list')) {
        return
      }

      const nbColumns = getColumnNumber(document.querySelector('.release-list'))
      // const nbLines = Math.floor(this.state.len / nbColumns)

      if (directionOfMovement === 'right') {
        this.setState({focused: focused === this.state.len - 1 ? 0 : focused + 1})
      }

      if (directionOfMovement === 'left') {
        this.setState({focused: focused === 0 ? this.state.len - 1: focused - 1})
      }

      if (directionOfMovement === 'top') {
        this.setState({focused: focused < nbColumns ? this.state.len - nbColumns + focused : focused - nbColumns})
      }

      if (directionOfMovement === 'bottom') {
        this.setState({focused: focused >= this.state.len - nbColumns ? focused - this.state.len + nbColumns : focused + nbColumns})
      }
    }

    this.subscriptions[0] = window.joypad.on('axis_move', throttle(eventListener))
    this.subscriptions[1] = window.joypad.on('button_press', (e) => {
      const { buttonName } = e.detail

      if (buttonName === 'button_9') {
        this.props.history.push('/picks')
        return
      }

      if (buttonName === 'button_8') {
        this.props.onSelect(this.state.collection[this.state.focused])
      }
    })

    this.initCollection()
  }

  componentWillUnmount() {
    this.subscriptions.map(e => e.unsubscribe())
  }

  render() {
    const current = this.state.collection.find((e, i) => i === this.state.focused)
    if (!current) return <div className='row'></div>

    return <div className='releases'>
      <div className='release-list-container'>
        <List focused={this.state.focused} itemClassName='nes-container' className='release-list' selected={this.props.selected}>
          {this.state.collection.map((e, i) => {
              // Force key to proper refresh when collection changes
              return <ReleaseItem key={e.title} src={e.artwork} alt={e.title} title={e.title} selected={this.props.selected.find(f => e.id === f.id)} />
          })}
        </List>
      </div>
      <div className='release-detail'>
        <div className='release-detail-cover-container'>
          <PixelatedImg src={current.artwork_large} alt={current.title} className='release-detail-cover' resolution='4' size='8' />
        </div>
        <h1>{current.title}</h1> <span>({current.year})</span>
      </div>
    </div>
  }
}
