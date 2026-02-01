import { useEffect, useRef, useState } from "react";
import { Dialog } from "../Komponentit/Dialog";
import "./Peli.css"
import { io, type Socket } from "socket.io-client";
import { useTilanne } from "./TilanneContext";
import Win from "./Voitto";


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

const taivutusmuodot = {
  "Ope": "Opejen",
  "Abi": "Abien",
  "Kakkonen": "Kakkosten",
}

export default function Pelialue() {
  const airhorn = useRef<HTMLAudioElement | null>(null)
  const music = useRef<HTMLAudioElement | null>(null)
  const win = useRef<HTMLAudioElement | null>(null)
  const buzzer = useRef<HTMLAudioElement | null>(null)
  const { value: tilanne, setValue: setTilanne } = useTilanne()
  const [rooli, setRooli] = useState<"Ope" | "Abi" | "Kakkonen" | null>(null)
  const [gameStatus, setGameStatus] = useState("")
  const categories = Object.keys(kysymykset);
  const values = Object.values(kysymykset);
  const [final, setFinal] = useState(false)
  const [disabled, setDisabled] = useState<number[][]>([])
  const [voittaja, setVoittaja] = useState<string | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [vastausTimeout, setVastausTimeout] = useState<number | null>(null)
  const [timeleft, setTimeleft] = useState<number>(0)
  const ref = useRef<HTMLDialogElement | null>(null);
  const UusiVuoro = () => {
    setTimeleft(10)
    setVastausTimeout(setInterval(() => {
      setTimeleft(tl => {
        if (tl == 0) {
          PäätäVuoro()
          setGameStatus("")
          clearInterval(vastausTimeout!)
          return 0;
        }
        return tl - 1;
      }
      )
    }, 1000))
    setGameStatus("Odotetaan vastausta...")
  }
  const PäätäVuoro = () => {
    socket.emit("asetanappi", { on: false })
    setRooli(null)
    setQuestion(null)
    setFinal(false)
  }
  useEffect(() => {
    if (gameStatus == "Odotetaan vastausta...") {
      music.current!.loop = true
      music.current?.play()
    } else {
      music.current?.pause()
    }
  }, [gameStatus])
  useEffect(() => {
    socket.on("gitpush", (data: { rooli: ("Ope" | "Abi" | "Kakkonen"), final: boolean }) => {
      if (gameStatus == "Odotetaan vastausta...") {
        buzzer.current?.play()
        if (vastausTimeout) clearInterval(vastausTimeout)
        setGameStatus(`${taivutusmuodot[data.rooli]} vastausvuoro`)
        setRooli(data.rooli)
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
      socket.emit("vapautakaikki")
      UusiVuoro()
    }
  }, [question])
  useEffect(() => {
    if (tilanne.abit >= 150) setVoittaja("Abit")
    if (tilanne.opet >= 150) setVoittaja("Opet")
    if (tilanne.kakkoset >= 150) setVoittaja("Kakkoset")
  }, [tilanne])
  useEffect(() => {
    airhorn.current?.play()
  }, [voittaja])
  return <div id="pelialue">
    <>
      <audio ref={airhorn} src="/sounds/airhorn.mp3"></audio>
      <audio ref={music} src="/sounds/music.mp3"></audio>
      <audio ref={buzzer} src="/sounds/buzzer.mp3"></audio>
      <audio ref={win} src="/sounds/win.mp3"></audio>
    </>
    {categories.map((key) => (
      <div key={key} className="red top">{key}</div>
    ))}
    {voittaja === null ? <></> : <Win winner={voittaja}></Win>}
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
        {rooli != null ?
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "50px"
          }}><img onClick={() => {
            win.current?.play()
            setTilanne(t => {
              return {
                abit: t.abit + (rooli == "Abi" ? question!.op : 0),
                opet: t.opet + (rooli == "Ope" ? question!.op : 0),
                kakkoset: t.kakkoset + (rooli == "Kakkonen" ? question!.op : 0),
              }
            })
            PäätäVuoro()
          }} src="/Check.png"></img><img onClick={() => {
            setRooli(null)
            buzzer.current?.play()
            if (final) {
              PäätäVuoro()
            } else {
              UusiVuoro()
              socket.emit("asetanappi", { on: true })
            }
          }} src="/X.png"></img></div> : <></>
        }
        <h4 style={{
          marginTop: "20px",
          alignSelf: "flex-start"
        }}>Tila: {gameStatus} {gameStatus == "Odotetaan vastausta..." ? `(${timeleft} s)` : ""}</h4>
      </div>
    </Dialog>
  </div>
}
