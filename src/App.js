import React from 'react';
import './css/App.css';
import './fonts/iconfont.css'
import Board from './board'             //棋盘
import Landmine from './landmine'       //炸弹
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
    this.handleClick = this.handleClick.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.columnsChange = this.columnsChange.bind(this)
    this.rowsChange = this.rowsChange.bind(this)
    this.createGridsArr = this.createGridsArr.bind(this)
  }

  handleClick(e, i){
    JSON.stringify(this.state.gridsArr) === '[]' && this.createGridsArr(e, i);
    let grids = this.state.grids.slice(); // 拷贝一个当前单元格数组
    let element; // 所操作单元格的元素JSX
    const currentItem = this.state.gridsArr[i] || '';
    if (!currentItem) return

    this.setState({
      currentIndex: i
    })

    if(e.button && e.button === 2){
      // 右键处理
      console.log('右键处理')
      if (currentItem.isOpen) return
      element = currentItem.flag ? (
        <div className="full-squares"></div>
      ) : (
        <div className="gird-item-box full-squares">
          <i className="iconfont iconhighest" style={{ color: 'red', textShadow: '0 10px 7px #000' }}></i>
        </div>
      );
      this.state.gridsArr[i].flag = !currentItem.flag;
    }else{
      // 左键处理
      console.log('左键处理')
      if(currentItem.flag){
        return;
      }
      switch (currentItem.type) {
        case 'bomb':
          element = <Landmine />;
          alert('GAME OVER!');
          break;
        case 'default':
          element = currentItem.value > 0 && currentItem.value;
          break;
        default:
          break;
      }
      this.state.gridsArr[i].isOpen = true;
    }

    if(currentItem.type === 'bomb' && e.button !== 2){
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
      // this.state.gridsArr = [0]
    }else{
      grids[i] = (
        <div className="grid-item">
          {element}
        </div>
      );
    }

    this.setState({
      grids: grids
    })
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
    }else{
      let gridsArr = Array.apply(
        null,
        Array(this.state.columns * this.state.rows)).map((item, index) => {
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
      gridsCount.splice(excludeIndex, 1)
      const columns = this.state.columns;
      for(let i=0; i<this.state.bombs; i++){
        let index = parseInt(gridsCount.splice(Math.floor(Math.random() * gridsCount.length), 1));
        gridsArr[index].type = 'bomb';
        // 上方
        if (gridsArr[index - columns]) {
          gridsArr[index - columns].value++
          // 左上
          if (gridsArr[index - columns - 1] && (index - columns) % columns !== 0) {
            gridsArr[index - columns - 1].value++
          }
          // 右上
          if (gridsArr[index - columns + 1] && (index - columns + 1) % columns !== 0) {
            gridsArr[index - columns + 1].value++
          }
        }
        // 下方
        if (gridsArr[index + columns]) {
          gridsArr[index + columns].value++
          // 左下
          if (gridsArr[index + columns - 1] && (index + columns) % columns !== 0) {
            gridsArr[index + columns - 1].value++
          }
          // 右下
          if (gridsArr[index + columns + 1] && (index + columns + 1) % columns !== 0) {
            gridsArr[index + columns + 1].value++
          }
        }
        // 左
        if (gridsArr[index - 1] && (index - 1) % columns !== 9) {
          gridsArr[index - 1].value++;
        }
        // 右
        if (gridsArr[index + 1] && (index + 1) % columns !== 0) {
          gridsArr[index + 1].value++;
        }
      }

      this.setState({
        gridsArr: gridsArr
      })
    }
    event && event.preventDefault();
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
          onClick={(e) => this.handleClick(e, i)}
          onMouseDown={(e) => this.handleClick(e, i)}
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
