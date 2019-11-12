import React from 'react';
import './fonts/iconfont.css' // From https://www.iconfont.cn/

class grids extends React.Component {
  render() {
    let element;
    const index = this.props.index;
    const gridsData = this.props.gridsData;
    const grid = this.props.gridsData[index];
    const flagElement = <i className="iconfont iconhighest" style={{ color: 'red', textShadow: '0 10px 7px #000' }}></i>;

    if (Array.isArray(gridsData) && gridsData.length > 0){
      if(grid.flag && grid.isOpen === false){
        element = flagElement;
      }else{
        switch (grid.type) {
          case 'mine':
            element = grid.isOpen && (
              <div className="grid-item-box" style={grid.flag ? { background: 'green' } : { background: 'red' }}>
                <i className="iconfont iconzhadan"></i>
              </div>
            );
            break;
          case 'default':
            element = grid.isOpen && (
              <div className="grid-item-box">
                {grid.value || ''}
              </div>
            )
            break;
          default:
            break;
        }
      }
    }

    element = element ? element : <div></div>;
    return element;
  }
}

export default grids;