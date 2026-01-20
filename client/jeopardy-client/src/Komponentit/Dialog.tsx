import { forwardRef, type CSSProperties, type ReactNode } from "react"
import "./Dialogstyle.css"


export const Dialog = forwardRef<HTMLDialogElement, { children: ReactNode, style?: CSSProperties }>((props, ref) => {
  return <dialog className="dialog" style={props.style} ref={ref}>
    {props.children}
  </dialog>
})

