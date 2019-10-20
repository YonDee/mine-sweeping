import React from 'react';
import './App.css';
import Landmine from'./landmine'

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      items: []
    }
    this.setting = this.setting.bind(this)
  }

  setting(number){
    for(var i=0; i<number; i++){
      this.state.items.push(
        <div key={i} className="item" >
          {/* <Landmine /> */}
        </div>
      )
    }
  }
  render(){
    this.setting(81)
    return (
      <div className="App">
        <div id="checkerboard">
          {this.state.items}
        </div>
      </div>
    );
  }
}

export default App;
