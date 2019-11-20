import React from 'react';
import './fonts/iconfont.css' // From https://www.iconfont.cn/
class grids extends React.Component {
  render() {
    let element;
    const index = this.props.index;
    const gridsData = this.props.gridsData;
    const grid = this.props.gridsData[index];
    let elementClass = "";
    let color;

    if (Array.isArray(gridsData) && gridsData.length > 0){
      if(grid.flag && grid.isOpen === false){
        element = <i className="iconfont iconhighest"></i>;
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
            // if(grid.isOpen === false && grid.isSink) {
            //   elementClass = 'grid-item'
            // }
            // create this gird element
            if(grid.value){
              // color switcher
              switch (grid.value) {
                case 1:
                  color = 'blue';
                  break;
                case 2:
                  color = 'green';
                  break;
                case 3:
                  color = 'red';
                  break;
                case 4:
                  color = 'purple';
                  break;
                case 5:
                  color = 'orange';
                  break;
                default:
                  color = 'black'
                  break;
              }
            }

            elementClass = "grid-item-box";
            elementClass += grid.value ? ' number-hover' : '';

            element = grid.isOpen && (
              <div
                className={elementClass}
                style={{color: color}}
                onMouseUp={this.props.computeGrid}
                onMouseDown={this.props.aroundSink}
              >
                {grid.value || ''}
              </div>
            )

            break;
          default:
            break;
        }

        if(!element && grid.isSink){
          console.log(11)
          element = <div className='grid-sink'></div>
        }
      }
    }

    element = element ? element : <div></div>;
    return element;
  }
}

export default grids;