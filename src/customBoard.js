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
        <label>Cols：</label>
        <input type="text" value={this.props.columns} onChange={this.props.columnsChange} />
        <br />
        <label>Rows：</label>
        <input type="text" value={this.props.rows} onChange={this.props.rowsChange} />
        <br />
        <label>Mines：</label>
        <input type="text" value={this.props.bombs} onChange={this.props.bombsChange}/>
        <br />
        <button onClick={this.props.onSubmit}>Setting & Start!</button>
      </form>
    )
  }
}

export default CustomBoard;