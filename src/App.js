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
      bombs: 0,
      gridsBoard: {
        columns: 10,
        rows: 10,
        bombs: 0
      }
    }
    this.handleClick = this.handleClick.bind(this)
    this.columnsChange = this.columnsChange.bind(this)
    this.rowsChange = this.rowsChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
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
    let newColumns = e.target.value <= 80 && e.target.value;
    this.setState({
      columns: newColumns
    })
  }

  rowsChange(e){
    let newRows = e.target.value <= 80 && e.target.value;
    this.setState({
      rows: newRows
    })
  }

  bombsChange(e){
    this.setState({
      bombs: e.target.value
    })
    console.log('现在有' + e.target.value + '个炸弹。')
  }

  onSubmit(event){
    // 设定 行 列 炸弹数量
    let newGrids = this.state.columns * this.state.rows
    let gridsBoard = {
      columns: this.state.columns,
      rows: this.state.columns,
      bombs: this.state.bombs
    }
    this.setState({
      gridsBoard: gridsBoard,
      grids: Array(newGrids).fill(<div className="full-squares"></div>),
    })
    event.preventDefault();
  }

  render(){
    let items = []
    for (var index = 0; index < this.state.gridsBoard.columns * this.state.gridsBoard.rows; index++) {
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
          onSubmit={(e) => this.onSubmit(e)}
        />
        <Board
          columns={this.state.gridsBoard.columns}
          rows={this.state.gridsBoard.rows}
        >
          {items}
        </Board>
        <Information index={this.state.currentIndex} />
      </div>
    );
  }
}

export default App;
