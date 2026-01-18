import { forwardRef, useEffect, useRef, useState } from "react"
import "./nappistyle.css"
import { Socket, io } from "socket.io-client"

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
  </button><ValitseRooli ref={ref} setRooli={setOpettaja}></ValitseRooli></>
}
const ValitseRooli = forwardRef<HTMLDialogElement, { setRooli: (val: boolean) => void }>((props, ref) => {
  return <dialog id="roolivalinta" ref={ref}>
    <h3>Valitse roolisi</h3>
    <div>
      <button onClick={() => {
        props.setRooli(true)
      }}>Opettaja</button>
      <button onClick={() => {
        props.setRooli(true)
      }}>Opiskelija</button>
    </div>
  </dialog>
})



