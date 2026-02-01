import ReactConfetti from "react-confetti"

export default function Win({ winner }: { winner: string }) {
  return <>
    <ReactConfetti width={window.innerWidth}></ReactConfetti>
    <div style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      fontSize: "64px",
      textAlign: "center",
      animation: "rainbowColor 3s infinite",
      backgroundColor: "black",
    }}>{winner} voittivat!</div>
  </>
}
