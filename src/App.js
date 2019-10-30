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
      },
      maxErr: false
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

  // 行
  columnsChange(e){
    this.setState({
      columns: e.target.value
    })
  }

  // 列
  rowsChange(e){
    this.setState({
      rows: e.target.value
    })
  }

  // 炸弹
  bombsChange(e){
    this.setState({
      bombs: e.target.value
    })
    console.log('现在有' + e.target.value + '个炸弹。')
  }

  // 提交自定义棋盘
  onSubmit(event){
    // 设定 行 列 炸弹数量
    let newGrids = this.state.columns * this.state.rows
    if(this.state.columns > 80 || this.state.rows > 80){
      this.state.maxErr = true
    }else{
      // 设定棋盘数组(直接可以决定展示内容)
      let gridsBoard = {
        columns: this.state.columns,
        rows: this.state.columns,
        bombs: this.state.bombs
      }

      let gridsArr = Array.apply(
        null,
        Array(newGrids)).map(() => {
        return {
          type: 'default',
          value: 0
        }
      });

      let gridsCount = [...Array(gridsArr.length).keys()];
      for(let i=0; i<this.state.bombs; i++){
        let index = Math.floor(Math.random() * this.state.bombs);
        gridsArr[gridsCount.splice(index, 1)] = {
          type: 'bomb',
          value: 0
        }
      }

      this.setState({
        gridsBoard: gridsBoard,
        grids: Array(newGrids).fill(<div className="full-squares"></div>),
      })
    }
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
        <div className="app-body">
          <div className="app-body-form">
            <CustomBoard
              columns={this.state.columns}
              rows={this.state.rows}
              bombs={this.state.bombs}
              columnsChange={(e) => this.columnsChange(e)}
              rowsChange={(e) => this.rowsChange(e)}
              bombsChange={(e) => this.bombsChange(e)}
              onSubmit={(e) => this.onSubmit(e)}
            />
            <br />
            <span className={'err-span'}>行/列最大支持80</span>
          </div>
          <Board
            columns={this.state.gridsBoard.columns}
            rows={this.state.gridsBoard.rows}
          >
            {items}
          </Board>
          <Information index={this.state.currentIndex} />
        </div>
      </div>
    );
  }
}

export default App;
