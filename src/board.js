import React from 'react';

class Board extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div id="board" style={{
        gridTemplateColumns: "repeat(" + (this.props.columns || 9) + ", 25px)",
        gridTemplateRows: "repeat(" + (this.props.rows || 9) + ", 25px)"
      }}>
        {this.props.children}
      </div>
    )
  }
}

export default Board;