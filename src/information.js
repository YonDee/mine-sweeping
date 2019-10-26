import React from 'react'
import './css/information.css'

class Information extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="info-box">
        <span>刚刚点击的组件下标：</span>{ this.props.index }
      </div>
    )
  }
}

export default Information;