import { forwardRef, type ReactNode } from "react"
import "./Dialogstyle.css"


export const Dialog = forwardRef<HTMLDialogElement, { children: ReactNode }>((props, ref) => {
  return <dialog className="dialog" ref={ref}>
    {props.children}
  </dialog>
})

