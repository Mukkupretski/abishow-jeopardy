import { useTilanne } from "./TilanneContext"

export default function Pistelaskuri() {
  const { value: tilanne } = useTilanne()
  return <>
    <div id="pistelaskuri">
      <div style={{
        height: `${tilanne.abit / 1.5}%`
      }}>{tilanne.abit}</div>
      <div style={{
        height: `${tilanne.opet / 1.5}%`
      }}>{tilanne.opet}</div>
      <div style={{
        height: `${tilanne.kakkoset / 1.5}%`
      }}>{tilanne.kakkoset}</div>
    </div> </>
}
