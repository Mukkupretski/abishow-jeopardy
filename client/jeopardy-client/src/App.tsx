import "./index.css"
import { Routes, Route } from "react-router-dom"
import Peli from "./Peli/Peli"
import Nappi from "./Nappi/Nappi"

function App() {

  return (
    <Routes>
      <Route path="napinpainaja" element={<Nappi></Nappi>}></Route>
      <Route path="omistaja" element={<Peli></Peli>}></Route>
    </Routes>
  )
}

export default App
