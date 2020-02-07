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
      <div className={(this.props.focus ? 'is-dark ' : ' ') + this.props.className}>
        {this.props.children}
      </div>
    </li>
  }
}

const List = ({list, selected, itemClassName, className, selectedList = []}) => {
  return <ul className={className}>
    {list.map((item, i) => {
      const isSelected = selectedList.indexOf(i) !== -1
      return <FocusableElement className={itemClassName + (isSelected ? ' is-selected' : '')} key={item.key || i} focus={selected === i}>{React.cloneElement(item, { selected, focused: i === selected, isSelected })}</FocusableElement>
    })}
  </ul>
}
export default List
