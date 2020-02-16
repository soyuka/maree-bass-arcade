import React from 'react'
import './Credits.scss'

const style = {filter: 'invert(100%)'}
export default function Credits({className}) {
  return <div className={'credits ' + className || ''}>
    Built with <img src='/heart.png' alt='heart' height='32px'/> by<br />
    soyuka, thcolin<br /><br />
    for<br /><br />
    <h3>Marée BASS</h3>
      <img src='/logo.webp' alt='logo' style={style}/><br /><br />
    Thanks
  </div>

}
