
// eslint-disable-next-line react/prop-types
export const Score = ( { score, userName, speed }) => {
  
  return (
    <div className="score">
      <div>PLAYER NAME:
        <span style={{color: 'red'}}> {userName}</span> 
      </div>
      <div>SCORE: {score} </div>
      <div>SPEED: {speed < 5 ? 'MIN' : `+${speed}%`}</div>
   </div>
  )
}
