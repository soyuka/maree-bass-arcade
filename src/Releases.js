import React from 'react'
import List from './List.js'
import PixelatedImg from './PixelatedImg.js'
import {throttle, normalize, getColumnNumber} from './utils.js'
import releases from './releases.json'
import './Releases.scss'

//sanitize
releases.collection = releases.collection.map((e) => {
  e.title = e.title.replace('https://www.mareebass.fr', '').replace('free download on ', '').replace('download & support on ', '').replace('...', '').replace('free on', '').replace('..', '')
  e.artwork_url = e.artwork_url.replace('https://i1.sndcdn.com/', '/artworks/')
  e.artwork_url_large = e.artwork_url.replace('large', 't500x500')
  e.release_date = new Date(e.release_date).getFullYear()
  return e
})

export default class Releases extends React.Component {
  constructor(props) {
    super(props)
    this.imagesLoaded = 0

    this.state = {
      collection: [],
      list: [],
      len: 0,
      selected: 0
    }
  }

  initCollection() {
    let collection = releases.collection
    const search = this.props.location.search

    if (search && search.substring(1)) {
      const params = new URLSearchParams(search.substring(1))

      if (params.has('artist')) {
        collection = collection.filter((e) => normalize(e.genre).includes(normalize(params.get('artist'))))
      }

      if (params.has('year')) {
        collection = collection.filter((e) => e.release_date === +params.get('year'))
      }
    }

    this.setState({collection, list: collection.map((e) => {
      // Force key to proper refresh when collection changes
      return <PixelatedImg src={e.artwork_url} alt={e.title} resolution='4' key={e.title} />
    }), len: collection.length})
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.initCollection()
    }
  }

  componentDidMount() {
    const eventListener = (e) => {
      const { directionOfMovement } = e.detail
      const selected = this.state.selected
      const nbColumns = getColumnNumber(document.querySelector('.release-list'))
      // const nbLines = Math.floor(this.state.len / nbColumns)

      if (directionOfMovement === 'right') {
        this.setState({selected: selected === this.state.len - 1 ? 0 : selected + 1})
      }

      if (directionOfMovement === 'left') {
        this.setState({selected: selected === 0 ? this.state.len - 1: selected - 1})
      }

      if (directionOfMovement === 'top') {
        this.setState({selected: selected < nbColumns ? this.state.len - nbColumns + selected : selected - nbColumns})
      }

      if (directionOfMovement === 'bottom') {
        this.setState({selected: selected >= this.state.len - nbColumns ? selected - this.state.len + nbColumns : selected + nbColumns})
      }
    }

    this.subscription = window.joypad.on('axis_move', throttle(eventListener))

    this.initCollection()
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    const current = this.state.collection.find((e, i) => i === this.state.selected)

    if (!current) return <div className='row'></div>

    return <div className='row'>
      <div className='col release-list-container'>
        <List list={this.state.list} selected={this.state.selected} itemClassName='nes-container' className='release-list' />
      </div>
      <div className='col-third release-detail'>
        <PixelatedImg src={current.artwork_url_large} alt={current.title} className='release-detail-cover' resolution='4' size='8' />
        <h1>{current.title}</h1> <span>({current.release_date})</span>
      </div>
    </div>
  }
}
