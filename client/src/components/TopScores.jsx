/* eslint-disable react/prop-types */

export const TopScores = ({loading, topRanks}) => {

  return (
    <>
      {!loading &&  
        <div className="topScores">
          <span className="items-head" >Top Scores </span>
          <div className="items">
            {topRanks?.map(rank => 
              <div className="item" key={rank.id}> {rank.userName} - {rank.scores} </div> 
            )}
          </div>
        </div>}

      {loading && <div className="loading">Loading...</div>}
    </>
  )
}
