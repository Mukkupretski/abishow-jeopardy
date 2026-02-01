import { useEffect, useRef, useState } from "react"
import "./nappistyle.css"
import { Socket, io } from "socket.io-client"
import { Dialog } from "../Komponentit/Dialog";

const socket: Socket = io('http://localhost:3000'); // Replace with Tailscale IP when online
export type NappiData = { vastanneet: string[], yleinen: boolean }

export default function Nappi() {
  const [rooli, setRooli] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement | null>(null)
  useEffect(() => {
    setTimeout(() => {
      ref.current?.showModal()
    }, 0)
  }, [])
  const [enabled, setEnabled] = useState<boolean>(true)
  useEffect(() => {
    socket.on("asetanappi2", (nappistatus: NappiData) => {
      console.log(nappistatus)
      setEnabled(nappistatus.yleinen && (nappistatus.vastanneet.find(v => v == rooli) == null))
      console.log(nappistatus.vastanneet.find(v => v == rooli) == null)
    })
    return () => {
      socket.off("asetanappi2")
    }
  }, [rooli])
  useEffect(() => {
    if (rooli !== null) ref.current?.close()
  }, [rooli])
  return <><button onClick={() => {
    socket.emit("gitpush", { rooli: rooli })
  }} disabled={!enabled || rooli === null} id="nappi">Vastaa
  </button><Dialog ref={ref} >
      <h3 style={{
        textAlign: "center",
        marginBottom: "20px"
      }}>Olen...</h3>
      <div style={{
        display: "flex",
        flexDirection: "row",
        gap: "80px",
        justifyContent: "space-around",
        boxSizing: "border-box",
        paddingInline: "20px",
      }}>
        <button className="dialogbutton" onClick={() => {
          setRooli("Ope")
        }}>Ope</button>
        <button className="dialogbutton" onClick={() => {
          setRooli("Abi")
        }}>Abi</button>
        <button className="dialogbutton" onClick={() => {
          setRooli("Kakkonen")
        }}>Kakkonen</button>
      </div>
    </Dialog></>
}



