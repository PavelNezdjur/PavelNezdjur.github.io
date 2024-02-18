import { Game } from "./components/Game"
import { useEffect, useState } from "react"

import '../src/styles/index.scss'
import logo from '/img/logo.png'



function App() {
  const [topRanks, setTopRanks] = useState(null)
  const [loading, setLoading] = useState(false)

  const [userName, setUserName] = useState('')

  const valide = userName?.trim()

  const [readyToGame, setReadyToGame] = useState(false)
  const readyHandler = () => setReadyToGame(prev => !prev)


  const getTopRanks = async () => {
    try {
      const response = await fetch('http://localhost:7000/players')
      const json = await response.json()
      setTopRanks(json)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoading(true)
    getTopRanks()
    setLoading(false)
  }, [])

  return <div className="container">
    {!readyToGame && 
      (<div className="start-page">
        <div className="text-field">
          <img src={logo} className="text-field-logo" />
          <input className="text-field__input" type="text" placeholder="enter your name" value={userName} onChange={(e) => setUserName(e.target.value)}/>
        </div>
        {valide && <button className="start-page-button" onClick={readyHandler}>START GAME</button>}
      </div>)}
      
      {readyToGame && <Game userName={userName} readyHandler={readyHandler} loading={loading} topRanks={topRanks} getTopRanks={getTopRanks}/>}
  </div>
  
}

export default App
