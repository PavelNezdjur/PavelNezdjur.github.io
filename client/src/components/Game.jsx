import { useEffect, useRef, useState } from "react"
import { Canvas } from "./Canvas"
import { draw, useLogic } from "../utils"
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../options"
import { Button } from "./Button"
import { Score } from "./Score"
import { TopScores } from "./TopScores"


// eslint-disable-next-line react/prop-types
export const Game = ({userName, readyHandler, loading, topRanks, getTopRanks}) => {

  const canvasRef = useRef(null)

 

  // RUN, PAUSE, GAME_OVER
  const [gameStatus, setGameStatus] = useState('RUN')

  // data of new player to save in DB
  const [data, setData] = useState({
    "userName": userName,
    "scores": 0,
  })

  // Save new player in DB
  const postData = async () => {
    try {
      await fetch('http://localhost:7000/players',{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
      getTopRanks()
    } catch (error) {
      console.log(error.message)
    }
  }

  const onGameOver = () => {
    setGameStatus('GAME_OVER')
    postData()
  }

  const { snakeBody, onKeyDownHandler, foodPosition, resetGame, score, speed } = useLogic({onGameOver, gameStatus})
 
  // update info for TopScores
  useEffect(() => {
    setData(data => ({
      ...data, 
      userName : userName,
      scores : score,
    }))
  }, [score, userName])

  const drawGame = (ctx) => {
    draw({ ctx, snakeBody, foodPosition })
  }
  
  return (
    <div className="game-container">
      <div className="game-container-inner">
        <div className="wrapper" tabIndex={0} onKeyDown={onKeyDownHandler} >
          <Canvas ref={canvasRef} draw={drawGame}  width={CANVAS_WIDTH} height={CANVAS_HEIGHT}/>
        </div>
        <div className="game-info">
          <div className="game-info-control">
            <Button status={gameStatus} setGameStatus={setGameStatus} resetGame={resetGame}/>
            {gameStatus === 'GAME_OVER' && <div className="game-over">GAME OVER</div>}
            <button className="button newGame" onClick={readyHandler}>NEW GAME</button>
          </div>
          <Score score={score} speed={speed} userName={userName}/>
        </div>
      </div>
      <div className="top-ranks">
        <TopScores loading={loading} topRanks={topRanks}/>
      </div>
    </div>
  )
}
