import React from 'react'
import './css/information.css'

class Information extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="info-box">
        <span>Current Grid Index：</span>{ this.props.index }
      </div>
    )
  }
}

export default Information;