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
      <form id="customize-board-form">
        <h4>Click and input your challenge:</h4>
        <label>Cols:</label>
        <input type="text" value={this.props.columns} onChange={this.props.columnsChange} />
        <br />
        <label>Rows:</label>
        <input type="text" value={this.props.rows} onChange={this.props.rowsChange} />
        <br />
        <label>Mines:</label>
        <input type="text" value={this.props.mines} onChange={this.props.minesChange}/>
        <br />
        <button onClick={this.props.onSubmit}>Setting & Start!</button>
      </form>
    )
  }
}

export default CustomBoard;