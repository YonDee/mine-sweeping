import React from 'react';
import './fonts/iconfont.css' // From https://www.iconfont.cn/
import './css/App.css';
import Board from './board'
import Grids from './grids'
import Information from './information'
import CustomizeBoardForm from './customizeBoardForm'
import Calculation from './libs/Calculation'
import ScoreShow from './scoreShow'

class App extends React.Component{
  state = {
    currentIndex: 0,
    gridsElement: [], // Grids Element
    gridsData: [],   // Grids Data
    columns: 10,
    rows: 10,
    mines: 20,
    gridsBoard: {},
    maxErr: false,
    calculation: new Calculation(),
    scoreShow: false,
    gameInformation: {
      isWin: false,
      time: ''
    }
  }

  handleClick(e, i){
    // Create 'gridsData' or continue.
    let gridsData = this.state.gridsData;
    const gridsBoard = this.state.gridsBoard;
    if( Array.isArray(gridsData) &&
      gridsData.length === 0 ){
      gridsData = this.createGridsData(e, i);
    }

    const columns = gridsBoard.columns;
    const rows = gridsBoard.rows;
    const gridsMax = columns * rows;

    const currentItem = gridsData[i] || '';
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
          this.setState({
            scoreShow: true
          })
          break;
        case 'default':
          if(currentItem.value === 0){
            const findLinkBlankGrid = this.findLinkBlankGrid(i, gridsData);
            if(Array.isArray(findLinkBlankGrid) && findLinkBlankGrid.length === 0){
              (this.state.calculation.getAroundGridIndex(
                i,
                columns,
                rows,
                gridsMax
              )).forEach(idx => {
                gridsData[idx].isOpen = true;
              })
            }else{
              findLinkBlankGrid.forEach(index => {
                gridsData[index].isOpen = true;
                (this.state.calculation.getAroundGridIndex(
                  index,
                  columns,
                  rows,
                  gridsMax
                )).forEach(idx => {
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

    const conditionOfVictory = {
      dangers: [],
      unprocessed: [],
      mines: this.state.gridsBoard.mines,
      flags: [],
    }
    gridsData.forEach(item => {
      if (item.type === 'mine' && item.flag === false) {
        conditionOfVictory.dangers.push(item)
      }
      if (item.isOpen === false && item.flag === false) {
        conditionOfVictory.unprocessed.push(item)
      }
      if (item.flag) {
        conditionOfVictory.flags.push(item)
      }
    })
    if(
      conditionOfVictory.dangers.length === 0 &&
      conditionOfVictory.unprocessed.length === 0 &&
      conditionOfVictory.flags.length == conditionOfVictory.mines
    ){
      this.setState({
        gameInformation: {
          isWin: true
        },
        scoreShow: true
      })
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
  findLinkBlankGrid(index, gridsData){
    if(!gridsData) gridsData = this.state.gridsData;
    const columns = this.state.gridsBoard.columns;
    const rows = this.state.gridsBoard.rows;
    const gridsMax = columns * rows;
    let finals = [];
    let aroundGridIndex = (index) => this.state.calculation.getAroundGridIndex(
      index,
      columns,
      rows,
      gridsMax
    );
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
   * aroundSink mousedown event
   * @param {number} index
   */
  aroundSink(index) {
    const gridsData = this.state.gridsData;
    const columns = this.state.gridsBoard.columns;
    const rows = this.state.gridsBoard.rows;
    const aroundGridIndex = this.state.calculation.getAroundGridIndex( index, columns, rows)
    aroundGridIndex.forEach(index => {
      gridsData[index].isSink = true;
    })
    this.setState({
      gridsData: gridsData
    })
  }

  /**
   * compute the gird around girds and set a state
   * @param {number} index
   */
  computeGrid(index){
    const gridsData = this.state.gridsData;
    const grid = gridsData[index];
    let noSafes = [];
    let flags = [];
    if(grid.isOpen && grid.value > 0){
      const aroundGridIndex = this.state.calculation.getAroundGridIndex(
        index,
        this.state.gridsBoard.columns,
        this.state.gridsBoard.rows
      )

      noSafes = aroundGridIndex.filter(index => {
        return gridsData[index].type === 'mine' && gridsData[index].flag === false;
      })

      flags = aroundGridIndex.filter(index => {
        return gridsData[index].flag === true;
      })

      console.log('找出这些下标？')
      console.log(noSafes)  // 这里是答案 :x

      aroundGridIndex.forEach(i => {
        gridsData[i].isSink = false;
        if(flags.length == grid.value) {
          if(gridsData[i].flag === false){
            gridsData[i].isOpen = true;
            this.handleClick({button: 1}, i, gridsData)
          }
        }
      })


      this.setState({
        gridsData: gridsData
      })
    }
  }

  /**
   * Submit custom board and create girds data.
   * @param {object} event
   * @param {number} excludeIndex
   */
  createGridsData(event, excludeIndex){
    let gridsData;
    // setting rows and columns
    if(this.state.columns > 80 || this.state.rows > 80){
      // exceeded the max number
      this.state.maxErr = true
    }else{
      gridsData = Array.apply(
        null,
        Array(this.state.gridsBoard.columns * this.state.gridsBoard.rows)).map((item, index) => {
        return {
          type: 'default',
          value: 0,
          flag: false,
          isOpen: false,
          isSink: false,
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
        let aroundGridIndex = this.state.calculation.getAroundGridIndex(index, columns, rows, maxGrids);
        gridsData[index].type = 'mine';
        aroundGridIndex.forEach(item => gridsData[item].value++)
      }

    }
    this.setState({
      gridsData: gridsData
    })
    event && event.preventDefault();
    return gridsData;
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
      gridsData: [],
      scoreShow: false
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
    const gridsBoard = this.state.gridsBoard;
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
            <ScoreShow
              scoreShow={this.state.scoreShow}
              gameAgain={() => this.handleSubmit()}
              gameInformation = {this.state.gameInformation}
            />
            {[...Array(!isNaN(gridsMax) && gridsMax).keys()].map(index =>
              <div
                key={'item-' + index}
                className="item"
                onMouseDown={(e) => this.handleClick(e, index)}
              >
                <div className="full-squares">
                  <Grids
                    gridsData={gridsData}
                    gridsBoard={gridsBoard}
                    computeGrid={() => this.computeGrid(index)}
                    aroundSink={() => this.aroundSink(index)}
                    index={index}
                    key={index}
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
