import { useEffect, useRef, useState } from "react";
import { Dialog } from "../Komponentit/Dialog";
import "./Peli.css"
import { io, type Socket } from "socket.io-client";
import { useTilanne } from "./TilanneContext";
import Win from "./Voitto";

const OP_MULTIPLIER = 10
const REDIRECT: boolean = false
const REDIRECT_LINK: string = "https://obby.lol"
//  https://www.youtube.com/watch?v=dQw4w9WgXcQ
// const SOCKET_ADDR = "http://localhost:3000"
const SOCKET_ADDR = "https://subpalmated-lucilla-nontenably.ngrok-free.dev/"

const kysymykset: { [key: string]: string[] } = {
  "Matematiikka": [
    "Mitä on 1 + 2?",
    "Kuinka monella tavalla 4 erilaista kirjaa voidaan pinota päällekkäin?",
    "Mikä on funktion e^(2x) derivaatta?",
    "Matkalla Kairoon...",
    "Mikä on piin 50. desimaali pilkun jälkeen?",
  ],
  "Historia": [
    "Minä vuonna Suomi itsenäistyi?",
    "Missä maassa teollistuminen alkoi?",
    "Milloin ensimmäinen maailmansota päättyi tuntien tarkkuudella?",
    "Mihin SPQR viittasi antiikin Roomassa?",
    "Kuinka monta laskiaispullaa Ruotsin kuningas Aadolf Fredrik väitetysti söi ennen kuin kuoli ylensyöntiin samana päivänä?",
  ],
  "Luonnontieteet": [
    "Minkä värisenä ihmissilmä näkee taivaan päivällä?",
    "Miksi kutsutaan orgaanisessa molekyylissä hiilistä muodostuvaa kuusikulmaista rengasta, jossa on 3 kaksoissidosta?",
    "Mikä on alfahiukkasen varaus?",
    "Tasapainoreaktio on endoterminen ja reaktioastian lämpötilaa lasketaan. Eteneekö reaktio tuotteiden suuntaan?",
    "Mikä on veden kiehumispiste yhden desimaalin tarkkuudella, kun vetyatomit ovat vedyn isotooppia Deuteriumia?",
  ],
  "Abit": [
    "Kuka 3m-luokan abi valittaa oppitunneilla äänekkäästi siitä, miten aika loppuu kesken esseetä kirjoittaessa?",
    "Kuka abi on opiskellut topologiaa, differentiaaligeometriaa ja homotopiateoriaa?",
    "Kuka 3m-luokan abi mainostaa luokkalaisilleen kylmiä suihkuja, hengitysharjoituksia ja sijoittamista?",
    "Kuka abi lähettää abiryhmään kuvia bileistä?",
    "Kuka 3m-luokan abi on pelannut videopeliä 'Geometry Dash' lähes 1400 tuntia?",
  ],
  "Opet": [
    "Kuka ope on sanonut: 'Jos ette aio tehdä tunnilla mitään, voitte yhtä hyvin poistua luokasta haaskaamasta happea'?",
    "Kuka ope kertoo usein opettaneensa koulussamme melkein 30 vuotta?",
    "Kuka ope on osallistunut kansainväliseen kokoukseen kenguruasussa?",
    "Kuka ope on laittanut oppitunnilla suuhunsa Heliumia?",
    "Mikä on Ville Tilviksen auton rekisterinumero?",
  ],
}
type Question = {
  category: string;
  op: number;
  question: string;
}

const socket: Socket = io(SOCKET_ADDR);

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
  const bell = useRef<HTMLAudioElement | null>(null)
  const { value: tilanne, setValue: setTilanne } = useTilanne()
  const [rooli, setRooli] = useState<"Ope" | "Abi" | "Kakkonen" | null>(null)
  const [gameStatus, setGameStatus] = useState("")
  const categories = Object.keys(kysymykset);
  const values = Object.values(kysymykset);
  const [final, setFinal] = useState(false)
  const [disabled, setDisabled] = useState<number[][]>([])
  useEffect(() => {
    if (REDIRECT) {
      window.location.replace(REDIRECT_LINK)
    }
  }, [])
  const [voittaja, setVoittaja] = useState<string | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)

  const ref = useRef<HTMLDialogElement | null>(null);
  const UusiVuoro = () => {
    socket.emit("nytvuorossa", { tiimi: null })
    setGameStatus("Odotetaan vastausta...")
  }
  const PäätäVuoro = () => {
    socket.emit("asetanappi", { on: false })
    socket.emit("nytvuorossa", { tiimi: null })
    setRooli(null)
    setQuestion(null)
    setFinal(false)
    setGameStatus("")
  }
  useEffect(() => {
    // if (gameStatus == "Odotetaan vastausta...") {
    //   music.current!.loop = true
    //   music.current?.play()
    // } else {
    //   music.current?.pause()
    // }
  }, [gameStatus])
  useEffect(() => {
    socket.on("gitpush", (data: { rooli: ("Ope" | "Abi" | "Kakkonen"), final: boolean }) => {
      if (gameStatus == "Odotetaan vastausta...") {
        bell.current?.play()
        socket.emit("nytvuorossa", { tiimi: data.rooli })
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
      <audio ref={bell} src="/sounds/bell.mp3"></audio>
      <audio ref={buzzer} src="/sounds/buzzer.mp3"></audio>
      <audio ref={win} src="/sounds/win.mp3"></audio>
    </>
    {categories.map((key) => (
      <div key={key} className="red top">{key}</div>
    ))}
    {voittaja === null ? <></> : <Win winner={voittaja}></Win>}
    {values.map((arr, colIndex) =>
      arr.map((item, rowIndex) => {
        console.log(item)
        let currentOff: boolean = false;
        if (disabled.find(val => val[0] == colIndex && val[1] == rowIndex)) currentOff = true;
        return <button onClick={() => {
          setDisabled((dis) => [...dis, [colIndex, rowIndex]])
          setQuestion(() => {
            return {
              op: (colIndex + 1) * OP_MULTIPLIER,
              category: categories[rowIndex],
              question: values[rowIndex][colIndex]
            }
          })

        }} disabled={currentOff} className={`red general${currentOff ? " off" : ""}`}
          key={`${colIndex}-${rowIndex}`}
        >{(colIndex + 1) * OP_MULTIPLIER} op</button>
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
        <div style={{
          marginTop: "20px",
          alignSelf: "flex-start",
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "30px"
        }}>
          <h4>Tila: {gameStatus} </h4>
          <h4 id="skip" style={{
            padding: "5px",
            marginLeft: "auto",
            borderRadius: "5px"
          }} onClick={() => {
            PäätäVuoro()
          }} >Ohita kysymys</h4>
        </div>
      </div>
    </Dialog>
  </div>
}
