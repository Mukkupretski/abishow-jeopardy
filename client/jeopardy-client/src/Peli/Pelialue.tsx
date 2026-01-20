import { useEffect, useRef, useState } from "react";
import { Dialog } from "../Komponentit/Dialog";
import "./Peli.css"
import { io, type Socket } from "socket.io-client";
import { useTilanne } from "./TilanneContext";


const kysymykset: { [key: string]: string[] } = {
  "Matematiikka": [
    "Mitä on 1 + 1",
    "Mitä on 2 + 1",
    "Mitä on 3 + 1",
    "Mitä on 4 + 1",
    "Mitä on 5 + 1",
  ],
  "Luonnontieteet": [
    "Mitä on 1 + 1",
    "Mitä on 2 + 1",
    "Mitä on 3 + 1",
    "Mitä on 4 + 1",
    "Mitä on 5 + 1",
  ],
  "Abit": [
    "Mitä on 1 + 1",
    "Mitä on 2 + 1",
    "Mitä on 3 + 1",
    "Mitä on 4 + 1",
    "Mitä on 5 + 1",
  ],
  "Opet": [
    "Mitä on 1 + 1",
    "Mitä on 2 + 1",
    "Mitä on 3 + 1",
    "Mitä on 4 + 1",
    "Mitä on 5 + 1",
  ],
  "Historia": [
    "Mitä on 1 + 1",
    "Mitä on 2 + 1",
    "Mitä on 3 + 1",
    "Mitä on 4 + 1",
    "Mitä on 5 + 1",
  ],
}
type Question = {
  category: string;
  op: number;
  question: string;
}

const socket: Socket = io('http://localhost:3000'); // Replace with Tailscale IP when online

export default function Pelialue() {
  const { setValue: setTilanne } = useTilanne()
  const [opettajat, setOpettajat] = useState<boolean | null>(null)
  const [gameStatus, setGameStatus] = useState("")
  const categories = Object.keys(kysymykset);
  const values = Object.values(kysymykset);
  const [final, setFinal] = useState(false)
  const [disabled, setDisabled] = useState<number[][]>([])
  const [question, setQuestion] = useState<Question | null>(null)
  const ref = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    socket.on("gitpush", (data: { opettaja: boolean, final: boolean }) => {
      if (gameStatus == "Odotetaan vastausta...") {
        setGameStatus(`${data.opettaja ? "Opejen" : "Abien"} vastausvuoro`)
        setOpettajat(data.opettaja)
        setFinal(data.final)
      }
    })
    return () => {
      socket.off("gitpush")
    }
  }, [gameStatus])
  useEffect(() => {
    if (question === null) {
      ref.current?.close()
      setGameStatus("")
    }
    else {
      ref.current?.showModal()
      setGameStatus("Odotetaan vastausta...")
      socket.emit("asetanappi", { opet: true, abit: true, yleinen: true })
    }
  }, [question])
  return <div id="pelialue">
    {categories.map((key) => (
      <div key={key} className="red top">{key}</div>
    ))}
    {values.map((arr, colIndex) =>
      arr.map((item, rowIndex) => {
        let currentOff: boolean = false;
        if (disabled.find(val => val[0] == colIndex && val[1] == rowIndex)) currentOff = true;
        return <button onClick={() => {
          setDisabled((dis) => [...dis, [colIndex, rowIndex]])
          setQuestion(() => {
            return {
              op: (colIndex + 1) * 10,
              category: categories[rowIndex],
              question: values[rowIndex][colIndex]
            }
          })

        }} disabled={currentOff} className={`red general${currentOff ? " off" : ""}`}
          key={`${colIndex}-${rowIndex}`}
        >{colIndex + 1}0 op</button>
      }
      )
    )}
    <Dialog style={{
      width: "50vw",
    }} ref={ref}>
      <div className="vastausboxi" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
      }}>
        <h2>{question?.category} {question?.op} op</h2>
        <h3 style={{
          fontWeight: "300",
          marginTop: "20px",
          marginBottom: "40px",
        }}>{question?.question}</h3>
        {opettajat != null ?
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "50px"
          }}><img onClick={() => {
            setTilanne(t => {
              return {
                abit: t.abit + (opettajat ? 0 : question!.op),
                opet: t.opet + (opettajat ? question!.op : 0)
              }
            })
            socket.emit("asetanappiyleinen", false)
            setQuestion(null)
            setOpettajat(null)
            setFinal(false)
          }} src="/Check.png"></img><img onClick={() => {
            setGameStatus("Odotetaan vastausta...")
            setOpettajat(null)
            if (final) {
              setQuestion(null)
              setFinal(false)
            } else {
              socket.emit("asetanappiyleinen", true)
            }
          }} src="/X.png"></img></div> : <></>
        }
        <h4 style={{
          marginTop: "20px",
          alignSelf: "flex-start"
        }}>Tila: {gameStatus}</h4>
      </div>
    </Dialog>
  </div>
}
