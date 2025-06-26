import { ReactNode, ButtonHTMLAttributes } from "react";
import "./Buttons.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export const BlueButton = ({ children, ...props }: ButtonProps) => (
    <button type="button" className="btn btn-outline-blue" {...props}>
        {children}
    </button>
);

export const YellowButton = ({ children, ...props }: ButtonProps) => (
    <button type="button" className="btn btn-outline-yellow" {...props}>
        {children}
    </button>
);

export const GrayButton = ({ children, ...props }: ButtonProps) => (
    <button type="button" className="btn btn-outline-gray" {...props}>
        {children}
    </button>
);