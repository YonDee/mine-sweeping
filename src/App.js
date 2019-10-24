import React from 'react';
import './App.css';
import './font_1313421_br608omz75m/iconfont.css'

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentIndex: 0,
      grids: Array(81).fill(<div className="full-squares"></div>)
    }
    this.handleClick = this.handleClick.bind(this)
  }

  renderItem(i){
  }

  handleClick(e, i){
    let grids = this.state.grids.slice();
    grids[i] = <i className="iconfont iconzhadan"></i>
    this.setState({
      grids: grids
    })
  }


  render(){
    let items = []
    for(var index=0; index<81; index++){
      const i = index;
      items.push(
        <div key={'item-' + i} className="item" onClick={(e) => this.handleClick(e, i)}>
          {/* <Grid index={i} currentIndex={this.state.currentIndex} /> */}
          {this.state.grids[i]}
        </div>
      )
    }
    return (
      <div className="App">
        {/* 需要独立出一个父级组件来控制，理解 children */}
        <div id="checkerboard">
          {items}
        </div>
        <span><label>当前点击的组件：</label>{ this.state.currentIndex }</span>
      </div>
    );
  }
}

export default App;
