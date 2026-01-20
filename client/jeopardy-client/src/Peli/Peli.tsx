import { Dialog } from "../Komponentit/Dialog";
import Pelialue from "./Pelialue";
import Pistelaskuri from "./Pistelaskuri";

export default function Peli() {
  return <div style={{
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100vh"
  }}>
    <div style={{
      marginTop: "20px",
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start"
    }}>
      <h1 className="jeopardy" style={{
        color: "var(--red)",
        fontSize: "60px"
      }}>JEOPARDY</h1>
      <h2 style={{
        color: "var(--red)",
        fontSize: "24px"
      }}>MAYK ABI EDITION</h2>
      <Pelialue></Pelialue>
    </div>
    <div style={{
      width: "18%",
      marginLeft: "5%",
      marginRight: "2%",
      paddingTop: "100px",
      display: "flex",
      justifyContent: "flex-end",
      flexDirection: "column",
      alignItems: "center",
      paddingBottom: "25px",
    }}>
      <div id="raja">150 op</div>
      <Pistelaskuri></Pistelaskuri>
      <div id="abitopet">
        <div>Abit</div>
        <div>Opet</div>
      </div>
      <img src="/pii.png" style={{
        width: "40%",
        aspectRatio: "1",
        marginTop: "40px"
      }
      }></img>
    </div>
  </div>
}
