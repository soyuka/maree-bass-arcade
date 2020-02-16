import React from 'react';
import { Link, withRouter } from "react-router-dom";

class GamepadLinkWithoutRouter extends React.Component {
  componentDidMount() {
    this.subscription = window.joypad.on('button_press', (e) => {
      if (!this.props.focused) return

      const { buttonName } = e.detail

      if (buttonName === 'button_8') {
        this.props.history.push(this.props.to.pathname)

        if (this.props.onSelect) {
          this.props.onSelect(this.props.selected)
        }
      }
    })
  }

  componentWillUnmount() {
    this.subscription.unsubscribe()
  }

  render() {
    return <Link to={this.props.to}>{this.props.children}</Link>
  }
}

const GamepadLink = withRouter(GamepadLinkWithoutRouter)
export default GamepadLink
