import React from 'react';
import './fonts/iconfont.css' // From https://www.iconfont.cn/
import './css/App.css';
import Board from './board'
import Grids from './grids'
import Information from './information'
import CustomizeBoardForm from './customizeBoardForm'

class App extends React.Component{
  state = {
    currentIndex: 0,
    gridsElement: [], // Grids Element
    gridsData: [],   // Grids Data
    columns: 10,
    rows: 10,
    mines: 20,
    gridsBoard: {},
    maxErr: false
  }

  handleClick(e, i){
    // Create 'gridsData' or continue.
    Array.isArray(this.state.gridsData) &&
    this.state.gridsData.length === 0 &&
    this.createGridsData(e, i);
    let gridsData = this.state.gridsData.slice();

    const currentItem = this.state.gridsData[i] || '';
    if (!currentItem) return

    if(e.button && e.button === 2){
      // click right
      if (currentItem.isOpen) return
      gridsData[i].flag = !currentItem.flag;
    }else{
      // click left
      if(currentItem.flag) return;

      switch (currentItem.type) {
        case 'mine':
          this.state.gridsData.map(item => {
            if(item.type === 'mine'){
              item.isOpen = true;
            }
          })
          break;
        case 'default':
          if(currentItem.value === 0){
            const findLinkBlankGrid = this.findLinkBlankGrid(i);
            if(Array.isArray(findLinkBlankGrid) && findLinkBlankGrid.length === 0){
              (this.getAroundGridIndex(i)).forEach(idx => {
                gridsData[idx].isOpen = true;
              })
            }else{
              findLinkBlankGrid.forEach(index => {
                gridsData[index].isOpen = true;

                (this.getAroundGridIndex(index)).forEach(idx => {
                  gridsData[idx].isOpen = true;
                })
              });
            }
          }
          break;
        default:
          break;
      }
      gridsData[i].isOpen = true;
    }

    this.setState({
      gridsData: gridsData,
      currentIndex: i
    })
  }

  /**
   * Find the current grid linked blank girds index.
   * @param {number} index
   */
  findLinkBlankGrid(index){
    const { gridsData} = this.state;
    let finals = [];
    let aroundGridIndex = (index) => this.getAroundGridIndex(index)
    const loop = arr => arr.forEach(i => {
      if(gridsData[i].value === 0 && !gridsData[i].isOpen){
        gridsData[i].isOpen = true;
        finals.push(i)
        loop(aroundGridIndex(i))
      }
    })
    loop(aroundGridIndex(index))
    finals.forEach(index => {
      aroundGridIndex(index)
    })
    return finals;
  }

  // Input columns number.
  columnsChange(e){
    this.setState({
      columns: e.target.value
    })
  }

  // Input rows number.
  rowsChange(e){
    this.setState({
      rows: e.target.value
    })
  }

  // Input mines nubmer.
  minesChange(e){
    this.setState({
      mines: e.target.value
    })
  }

  /**
   * Submit custom board and create girds data.
   * @param {object} event
   * @param {number} excludeIndex
   */
  createGridsData(event, excludeIndex){
    // setting rows and columns
    if(this.state.columns > 80 || this.state.rows > 80){
      // exceeded the max number
      this.state.maxErr = true
    }else{
      let gridsData = Array.apply(
        null,
        Array(this.state.gridsBoard.columns * this.state.gridsBoard.rows)).map((item, index) => {
        return {
          type: 'default',
          value: 0,
          flag: false,
          isOpen: false,
          key: index
        }
      });

      // Setting mines
      let gridsCount = [...Array(gridsData.length).keys()];
      const columns = this.state.gridsBoard.columns;
      const rows = this.state.gridsBoard.rows;
      const maxGrids = columns * rows;
      gridsCount.splice(excludeIndex, 1)
      for(let i=0; i<this.state.mines; i++){
        let index = gridsCount.splice(Math.floor(Math.random() * gridsCount.length), 1);
        let aroundGridIndex = this.getAroundGridIndex(index, columns, rows, maxGrids);
        gridsData[index].type = 'mine';
        aroundGridIndex.map(item => {
          gridsData[item].value++
        })
      }

      this.setState({
        gridsData: gridsData
      })
    }
    event && event.preventDefault();
  }

  /**
   * @param {number} index
   * @param {number} columns
   * @param {number} rows
   * @param {number} max
   */
  getAroundGridIndex(index, columns, rows, max){
    index = parseInt(index);
    columns = parseInt(columns || this.state.gridsBoard.columns);
    rows = parseInt(rows || this.state.gridsBoard.rows);
    max = parseInt(max);
    const maxGrids = max || columns * rows;
    const top = index - columns;
    const bottom = index + columns;
    const left = index - 1;
    const right = index + 1;
    let aroundGridIndex = [];

    if (left >= 0 && index % columns > 0) {
      aroundGridIndex.push(left)
      if (top > 0) {
        aroundGridIndex.push(top - 1)
      }
      if (bottom < maxGrids) {
        aroundGridIndex.push(bottom - 1)
      }
    }
    if (right > 0 && right % columns > 0) {
      aroundGridIndex.push(right)
      if (top >= 0) {
        aroundGridIndex.push(top + 1)
      }
      if (bottom < maxGrids) {
        aroundGridIndex.push(bottom + 1)
      }
    }
    if (top >= 0) {
      aroundGridIndex.push(top)
    }
    if (bottom < maxGrids) {
      aroundGridIndex.push(bottom)
    }

    return aroundGridIndex;
  }

  handleSubmit(event){
    let gridsMax = this.state.columns * this.state.rows;
    this.setState({
      gridsBoard: {
        columns: this.state.columns,
        rows: this.state.rows,
        mines: this.state.mines
      },
      grids: Array(gridsMax).fill(<div className="full-squares"></div>),
      gridsData: []
    })
    event && event.preventDefault();
  }

  componentDidMount(){
    this.handleSubmit();
    // Cancel mouse default event.
    const element = document.getElementById('board');
    element.oncontextmenu = function(e) {
      e.preventDefault();
    }
  }

  render(){
    const gridsData = this.state.gridsData;
    const gridsMax = this.state.gridsBoard.columns * this.state.gridsBoard.rows;
    return (
      // render element
      <div className="App">
        <div className="app-body">
          <div className="app-body-form">
            <CustomizeBoardForm
              columns={this.state.columns}
              rows={this.state.rows}
              mines={this.state.mines}
              columnsChange={(e) => this.columnsChange(e)}
              rowsChange={(e) => this.rowsChange(e)}
              minesChange={(e) => this.minesChange(e)}
              onSubmit={(e) => this.handleSubmit(e)}
            />
            <br />
            <span className={'err-span'}>Cols / Rows MAX 80</span>
          </div>
          <Board
            columns={this.state.gridsBoard.columns}
            rows={this.state.gridsBoard.rows}
          >
            {[...Array(!isNaN(gridsMax) && gridsMax).keys()].map(index =>
              <div
                key={'item-' + index}
                className="item"
                onMouseDown={(e) => this.handleClick(e, index)}
                onClick={(e) => this.handleClick(e, index)}
              >
                <div className="full-squares">
                  <Grids
                    gridsData = {gridsData}
                    index = {index}
                    key = {index}
                  />
                </div>
              </div>
            )}
          </Board>
          <Information index={this.state.currentIndex} />
        </div>
      </div>
    );
  }
}

export default App;
