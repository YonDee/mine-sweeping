import React from 'react';
import './css/App.css';
import './font_1313421_br608omz75m/iconfont.css'
import Board from './board'
import Landmine from './landmine'
import Information from './information'
import CustomBoard from './customBoard'

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentIndex: 0,
      grids: Array(100).fill(<div className="full-squares"></div>),
      columns: 10,
      rows: 10,
      bombs: 0
    }
    this.handleClick = this.handleClick.bind(this)
    this.columnsChange = this.columnsChange.bind(this)
    this.rowsChange = this.rowsChange.bind(this)
  }

  handleClick(e, i){
    this.setState({
      currentIndex: i
    })
    let grids = this.state.grids.slice();
    grids[i] = (
      <div className="grid-item">
        <Landmine />
      </div>
    );
    this.setState({
      grids: grids
    })
  }

  columnsChange(e){
    let newRows = e.target.value <= 80 && e.target.value;
    if(!newRows) return
    let newColumns = e.target.value
    let newGrids = newColumns * this.state.rows
    this.setState({
      columns: newColumns,
      grids: Array(newGrids).fill(<div className="full-squares"></div>),
    })
  }

  rowsChange(e){
    let newRows = e.target.value <= 80 && e.target.value;
    if(!newRows) return
    let newGrids = this.state.columns * newRows;
    this.setState({
      rows: newRows,
      grids: Array(newGrids).fill(<div className="full-squares"></div>),
    })
  }

  bombsChange(e){
    this.setState({
      bombs: e.target.value
    })
    console.log('现在有' + e.target.value + '个炸弹。')
  }

  render(){
    let items = []
    for(var index=0; index<this.state.columns * this.state.rows; index++){
      const i = index;
      items.push(
        <div key={'item-' + i} className="item" onClick={(e) => this.handleClick(e, i)}>
          {this.state.grids[i]}
        </div>
      )
    }
    return (
      <div className="App">
        <CustomBoard
          columns={this.state.columns}
          rows={this.state.rows}
          bombs={this.state.bombs}
          columnsChange={(e) => this.columnsChange(e)}
          rowsChange={(e) => this.rowsChange(e)}
          bombsChange={(e) => this.bombsChange(e)}
        />
        <Board
          columns={this.state.columns}
          rows={this.state.rows}
        >
          {items}
        </Board>
        <Information index={this.state.currentIndex} />
      </div>
    );
  }
}

export default App;
