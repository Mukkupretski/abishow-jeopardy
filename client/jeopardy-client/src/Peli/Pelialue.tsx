import "./Peli.css"


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

export default function Pelialue() {
  const categories = Object.keys(kysymykset);
  const values = Object.values(kysymykset);
  return <div id="pelialue">
    {categories.map((key) => (
      <div key={key} className="red top">{key}</div>
    ))}
    {values.map((arr, colIndex) =>
      arr.map((item, rowIndex) => (
        <button className="red general"
          key={`${colIndex}-${rowIndex}`}
        >{colIndex + 1}0 op</button>
      ))
    )}
  </div>
}
