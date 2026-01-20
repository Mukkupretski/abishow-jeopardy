import { useEffect, useRef, useState } from "react"
import "./nappistyle.css"
import { Socket, io } from "socket.io-client"
import { Dialog } from "../Komponentit/Dialog";

const socket: Socket = io('http://localhost:3000'); // Replace with Tailscale IP when online
export type NappiData = { opet: boolean, abit: boolean, yleinen: boolean }

export default function Nappi() {
  const [opettaja, setOpettaja] = useState<boolean | null>(null);
  const ref = useRef<HTMLDialogElement | null>(null)
  useEffect(() => {
    setTimeout(() => {
      ref.current?.showModal()
    }, 0)
  }, [])
  const [enabled, setEnabled] = useState<boolean>(true)
  useEffect(() => {
    socket.on("asetanappi", (nappistatus: NappiData) => {
      setEnabled(nappistatus.yleinen && !((!nappistatus.abit && !opettaja) || (!nappistatus.opet && opettaja)))
    })
    return () => {
      socket.off("asetanappi")
    }
  })
  useEffect(() => {
    if (opettaja !== null) ref.current?.close()
  }, [opettaja])
  return <><button onClick={() => {
    socket.emit("gitpush", { opettaja: opettaja })
  }} disabled={!enabled || opettaja === null} id="nappi">Vastaa
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
          setOpettaja(true)
        }}>Ope</button>
        <button className="dialogbutton" onClick={() => {
          setOpettaja(false)
        }}>Abi</button>
      </div>
    </Dialog></>
}



