import { Form } from 'react-bootstrap';
import {useTheme} from "../../ThemeContext.tsx";
import {FaMoon, FaSun} from "react-icons/fa";
import React from "react";



const Switch: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="d-flex align-items-center">
            <FaSun className={`me-2 ${!isDark ? 'text-warning' : 'text-muted'}`} />
            <Form.Check
                type="switch"
                id="theme-switch"
                checked={isDark}
                onChange={toggleTheme}
                className="mx-2"
            />
            <FaMoon className={`ms-2 ${isDark ? 'text-info' : 'text-muted'}`} />
        </div>
    );
};

export default Switch;
