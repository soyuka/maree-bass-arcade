import React from 'react'
import './App.scss'
import Game from './Game.js'
import { BrowserRouter as Router, withRouter } from "react-router-dom";

const GameWithRouter = withRouter(Game)

export default function App() {
  return <Router><GameWithRouter /></Router>
}
