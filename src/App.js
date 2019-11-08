import React from 'react';
import './css/App.css';
import './fonts/iconfont.css'
import Board from './board'             //棋盘
import Information from './information' //信息组件
import CustomBoard from './customBoard' //自定义棋盘表单组件

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      currentIndex: 0,
      grids: Array(100).fill(<div className="full-squares"></div>),
      gridsArr: [],   // 实际参考的表格数据
      columns: 10,    // 受控组件绑定的数据 行
      rows: 10,       // 受控组件绑定的数据 列
      bombs: 20,
      gridsBoard: {}, // 实际应用的表格数据
      maxErr: false
    }
  }

  handleClick(e, i){
    JSON.stringify(this.state.gridsArr) === '[]' && this.createGridsArr(e, i); // 如果不存在相关参考数组则创建一个新的
    let grids = this.state.grids.slice();           // 拷贝一个当前单元格
    let gridsArr = this.state.gridsArr.slice();     // 拷贝当前单元格数组信息
    let element;                                    // 所操作单元格的元素JSX
    const mineElement = (
      <div className="grid-item-box">
        <i className="iconfont iconbaozha"></i>
        <i className="iconfont iconzhadan"></i>
      </div>
    );

    const currentItem = this.state.gridsArr[i] || '';
    if (!currentItem) return

    if(e.button && e.button === 2){
      // 右键处理
      console.log('右键处理')
      if (currentItem.isOpen) return
      element = currentItem.flag ? (
        <div className="full-squares"></div>
      ) : (
        <div className="grid-item-box full-squares">
          <i className="iconfont iconhighest" style={{ color: 'red', textShadow: '0 10px 7px #000' }}></i>
        </div>
      );
      gridsArr[i].flag = !currentItem.flag;
      grids[i] = element;
    }else{
      // 左键处理
      console.log('左键处理')
      if(currentItem.flag) return;

      switch (currentItem.type) {
        case 'bomb':
          element = mineElement;
          this.state.gridsArr.map(item => {
            if(item.type === 'bomb'){
              grids[item.key] = (
                <div className="grid-item" style={item.flag ? { background: 'green' } : {}}>
                  {element}
                </div>
              )
            }
          })
          grids[i] = (
            <div className="grid-item" style={{background: 'red'}}>
              {element}
            </div>
          )
          break;
        case 'default':
          element = currentItem.value > 0 && currentItem.value;
          grids[i] = (
            <div className="grid-item">
              {element}
            </div>
          );
          if(currentItem.value === 0){
            (this.findLinkBlankGrid(i)).forEach(index => {
              grids[index] = (
                <div className="grid-item">
                  {element}
                </div>
              )
              gridsArr[index].isOpen = true;

              (this.getAroundGridIndex(index)).forEach(idx => {
                grids[idx] = (
                  <div className="grid-item">
                    {gridsArr[idx].value || ''}
                  </div>
                )
                gridsArr[idx].isOpen = true;
              })

            })
          }
          break;
        default:
          break;
      }
      gridsArr[i].isOpen = true;
    }

    this.setState({
      grids: grids,
      gridsArr: gridsArr,
      currentIndex: i
    })
  }

  /**
   * 查找当前所点击空白方块所连接到的空白方块下标
   * @param {number} index
   */
  findLinkBlankGrid(index){
    const { gridsArr} = this.state;
    let finals = [];
    let aroundGridIndex = (index) => this.getAroundGridIndex(index)
    const loop = arr => arr.forEach(i => {
      if(gridsArr[i].value === 0 && !gridsArr[i].isOpen){
        gridsArr[i].isOpen = true;
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

  // 输入行
  columnsChange(e){
    this.setState({
      columns: e.target.value
    })
  }

  // 输入列
  rowsChange(e){
    this.setState({
      rows: e.target.value
    })
  }

  // 输入炸弹数量
  bombsChange(e){
    this.setState({
      bombs: e.target.value
    })
  }

  // 提交自定义棋盘
  createGridsArr(event, excludeIndex){
    // 设定 行 列
    if(this.state.columns > 80 || this.state.rows > 80){
      this.state.maxErr = true
      console.log('超过限定行列。')
    }else{
      let gridsArr = Array.apply(
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

      // 埋 炸弹数量
      let gridsCount = [...Array(gridsArr.length).keys()];
      const columns = this.state.gridsBoard.columns;
      const rows = this.state.gridsBoard.rows;
      const maxGrids = columns * rows;
      gridsCount.splice(excludeIndex, 1)
      for(let i=0; i<this.state.bombs; i++){
        let index = gridsCount.splice(Math.floor(Math.random() * gridsCount.length), 1);
        let aroundGridIndex = this.getAroundGridIndex(index, columns, rows, maxGrids);
        gridsArr[index].type = 'bomb';
        aroundGridIndex.map(item => {
          gridsArr[item].value++
        })
      }

      this.setState({
        gridsArr: gridsArr
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
    this.setState({
      gridsBoard: {
        columns: this.state.columns,
        rows: this.state.rows,
        bombs: this.state.bombs
      },
      grids: Array(this.state.columns * this.state.rows).fill(<div className="full-squares"></div>),
      gridsArr: []
    })
    event && event.preventDefault();
  }

  componentDidMount(){
    this.handleSubmit();
    const element = document.getElementById('board');
    element.oncontextmenu = function(e) {
      e.preventDefault();
    }
  }

  render(){
    let items = []
    for (var index = 0; index < this.state.gridsBoard.columns * this.state.gridsBoard.rows; index++) {
      const i = index;
      items.push(
        <div
          key={'item-' + i}
          className="item"
          onMouseDown={(e) => this.handleClick(e, i)}
          onClick={(e) => this.handleClick(e, i)}
        >
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
              onSubmit={(e) => this.handleSubmit(e)}
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
