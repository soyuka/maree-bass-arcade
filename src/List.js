import React from 'react'
import './List.scss'

class FocusableElement extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidMount() {
    this.scrollToWhenFocused()
  }

  componentDidUpdate(props) {
    this.scrollToWhenFocused()
  }

  scrollToWhenFocused() {
    if (this.props.focus === true) {
      this.ref.current.scrollIntoView({behavior: 'instant', block: 'center', inline: 'nearest'})
    }
  }

  render() {
    return <li ref={this.ref}>
      <div className={(this.props.focus ? 'is-dark ' : ' ') + (this.props.className || '')}>
        {this.props.children}
      </div>
    </li>
  }
}

const List = ({children, focused, itemClassName, className}) => {
  return <ul className={className}>
    {children.map((item, i) => {
      return <FocusableElement className={itemClassName} key={item.key || i} focus={focused === i}>{React.cloneElement(item, { focused: i === focused })}</FocusableElement>
    })}
  </ul>
}
export default List
