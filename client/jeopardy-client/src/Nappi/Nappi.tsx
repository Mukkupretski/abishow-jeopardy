import { useEffect, useRef, useState } from "react"
import "./nappistyle.css"
import { Socket, io } from "socket.io-client"
import { Dialog } from "../Komponentit/Dialog";

const socket: Socket = io('http://localhost:3000'); // Replace with Tailscale IP when online

export default function Nappi() {
  const [opettaja, setOpettaja] = useState<boolean | null>(null);
  const ref = useRef<HTMLDialogElement | null>(null)
  useEffect(() => {
    setTimeout(() => {
      ref.current?.showModal()
    }, 0)
  }, [])
  useEffect(() => {
    socket.emit("gitpush", { opettaja: true })
  }, [])
  useEffect(() => {
    if (opettaja !== null) ref.current?.close()
  }, [opettaja])
  return <><button id="nappi">Vastaa
  </button><Dialog ref={ref} >
      <h3>Valitse roolisi</h3>
      <div>
        <button onClick={() => {
          setOpettaja(true)
        }}>Opettaja</button>
        <button onClick={() => {
          setOpettaja(false)
        }}>Opiskelija</button>
      </div>
    </Dialog></>
}



