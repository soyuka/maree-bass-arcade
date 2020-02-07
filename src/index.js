import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './nes.scss'
import App from './App';
import * as serviceWorker from './serviceWorker';
import demo from './demo.js'

ReactDOM.render(<App />, document.getElementById('root'));

// setTimeout(() => {
// demo()
// }, 1000)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
