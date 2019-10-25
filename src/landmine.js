import React from 'react';
import './css/landmine.css';

class Landmine extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      baozhaStyle: {
        color: 'red',
        fontSize: '40px',
        position: 'absolute',
        zIndex: '1'
      },
      zhadanStyle: {
        position: 'absolute',
        zIndex: '2',
        fontSize: '25px'
      }
    }
  }
  render() {
    return (
      <div className="gird-item-box">
        <i className="iconfont iconbaozha"></i>
        <i className="iconfont iconzhadan"></i>
      </div>
    )
  }
}

export default Landmine;