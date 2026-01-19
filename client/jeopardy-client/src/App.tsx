import "./index.css"
import { Routes, Route } from "react-router-dom"
import Peli from "./Peli/Peli"
import Nappi from "./Nappi/Nappi"
import { TilanneProvider } from "./Peli/TilanneContext"

function App() {

  return (
    <TilanneProvider>
      <Routes>
        <Route path="napinpainaja" element={<Nappi></Nappi>}></Route>
        <Route path="omistaja" element={<Peli></Peli>}></Route>
      </Routes>
    </TilanneProvider>
  )
}

export default App
