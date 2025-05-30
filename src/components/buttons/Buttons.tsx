import {ReactNode} from "react";
import "./Buttons.scss"
interface buttonProps{
children:ReactNode;
}

export const BlueButton = ({children}:buttonProps) => {
    return (
    <button type={"button"} className="btn btn-outline-blue">{children}</button>
    )
}
export const YellowButton = ({children}:buttonProps) => {
    return (
        <button type={"button"} className="btn btn-outline-yellow">{children}</button>
    )
}
export const GrayButton = ({children}:buttonProps) => {
    return (
        <button type={"button"} className="btn btn-outline-gray">{children}</button>
    )
}