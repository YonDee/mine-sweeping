import React from 'react';
import './css/landmine.css';

class Landmine extends React.Component {
  constructor(props){
    super(props);
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