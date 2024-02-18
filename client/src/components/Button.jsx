

// eslint-disable-next-line react/prop-types
export const Button = ({status, setGameStatus, resetGame}) => {
  return (
   <div className="button-wrapper">
      {status === 'RUN' && <button className="button pause" onClick={()=>setGameStatus('PAUSE')}>PAUSE</button>}
      {status === 'PAUSE' && <button className="button play" onClick={()=>setGameStatus('RUN')}>PLAY</button>}
      {status === 'GAME_OVER' && <button className="button gameOver" onClick={() => {setGameStatus('RUN'); resetGame() }}>PLAY AGAIN</button>}
   </div>
  )
}
