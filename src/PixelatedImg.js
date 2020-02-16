import React from 'react'
import './close-pixelate.js'

export default class PixelatedImg extends React.Component {
  constructor(props) {
    super(props)
    this.imgRef = React.createRef();
    this.parentNode = null
    this.pixelated = null
  }

  pixelate() {
    if (!this.imgRef.current || !this.imgRef.current.parentNode) {
      return
    }

    const options = {shape: 'square', size: this.props.resolution, offset: 0, alpha: 1, ...this.props}
    this.pixelated = new window.ClosePixelation(this.imgRef.current, [options])
    this.parentNode.classList.remove('pixelating')
  }

  removeCanvas() {
    if (!this.parentNode || !this.pixelated || !this.pixelated.canvas) return
    this.parentNode.removeChild(this.pixelated.canvas)
  }

  createImg() {
    const imgRef = document.createElement('img')
    imgRef.className = this.props.className
    imgRef.src = this.props.src
    imgRef.alt = this.props.alt
    imgRef.onLoad = this.handleImageLoaded.bind(this)
    imgRef.onError = this.handleImageErrored.bind(this)
    this.imgRef.current = imgRef
    this.parentNode.insertBefore(imgRef, this.parentNode.firstChild);
  }

  handleImageLoaded() {
    requestAnimationFrame(() => {
       this.pixelate()
    })
  }

  handleImageErrored() {
    console.error('image load error')
  }

  componentDidMount() {
    this.parentNode = this.imgRef.current.parentNode
    this.parentNode.classList.add('pixelating')
  }

  componentDidUpdate(prevProps) {
    if (this.props.src !== prevProps.src) {
      try {
        this.removeCanvas()
      } catch (e) {}
      this.createImg()
    }
  }

  render() {
    return <img className={this.props.className} ref={this.imgRef} src={this.props.src} alt={this.props.alt} onLoad={this.handleImageLoaded.bind(this)} onError={this.handleImageErrored.bind(this)} />
  }

}
