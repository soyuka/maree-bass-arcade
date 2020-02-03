import React from 'react'
import './List.scss'

class FocusableElement extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidUpdate(props) {
    if (this.props.focus === true) {
      this.ref.current.scrollIntoView({behavior: 'instant', block: 'center', inline: 'nearest'})
    }
  }

  render() {
    return <li ref={this.ref}><div className={(this.props.focus ? 'is-dark ' : ' ') + this.props.className}>{this.props.children}</div></li>
  }
}

const List = ({list, selected, itemClassName, className}) => {
  return <ul className={className}>
    {list.map((item, i) => <FocusableElement className={itemClassName} key={item.key || i} focus={selected === i}>{item}</FocusableElement>)}
  </ul>
}
export default List
