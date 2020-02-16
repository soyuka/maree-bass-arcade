import React from 'react'
import QRCode from 'qrcode'
import './Picks.scss'

export default class Picks extends React.Component
{
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
  }

  componentDidMount() {
    const url = 'https://mareebass.fr/dl.php?' + this.props.selected.reduce((a, b, i) => {
      return a + `${i === 0 ? '?' : '&'}i[]=`+b.id
    }, '')

    QRCode.toCanvas(this.canvasRef.current, url, {width: 500},  function (error) {
      if (error) console.error(error)
    })
  }

  render() {
    return <div className="qrcode"><canvas ref={this.canvasRef}></canvas></div>
  }
}
