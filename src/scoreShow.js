import React from 'react'

class GameOver extends React.Component {
  render(){
    let gameInformation = this.props.gameInformation;
    const element = (
      <div
        style={this.props.scoreShow ? {display: "flex"} : {display: "none"}}
        className={"score-show " + (gameInformation.isWin ? 'game-win' : 'game-over')}
      >
        <div className="title">
          {gameInformation.isWin ? 'You WIN!' : 'Game Over!'}
        </div>
        <div>
          Game Info:
          <div>
            none
          </div>
        </div>
        <div className="button">
          <button
            onClick={this.props.gameAgain}
            className='gameButton'
          >Continue ?</button>
        </div>
      </div>
    );
    return element;
  }
}

export default GameOver;