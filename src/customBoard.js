import React from 'react'

class CustomBoard extends React.Component {
  constructor(props){
    super(props)
    this.state={
      value: ''
    }
  }
  render() {
    return (
      <form>
        <label>行数：</label>
        <input type="text" value={this.props.columns} onChange={this.props.columnsChange} />
        <br />
        <label>列数：</label>
        <input type="text" value={this.props.rows} onChange={this.props.rowsChange} />
        <br />
        <label>地雷数：</label>
        <input type="text" value={this.props.bombs} onChange={this.props.bombsChange}/>
        <br />
        <button onClick={this.props.onSubmit}>提交</button>
      </form>
    )
  }
}

export default CustomBoard;