import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  var items = [];
  for(var i=0; i<16; i++){
    items.push(
      <div key={i} className="item">{i+1}</div>
    )
  }
  return (
    <div className="App">
      <div id="checkerboard">
        {items}
      </div>
    </div>
  );
}

export default App;
