import { useTheme } from "../../ThemeContext.tsx";
import { FaMoon, FaSun } from "react-icons/fa";
import React from "react";

const Switch: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="d-flex align-items-center" style={{ gap: 12 }}>
            {/* Sol */}
            <span
                style={{
                    opacity: !isDark ? 1 : 0.4,
                    color: !isDark ? "#FFD600" : "#bbb",
                    filter: !isDark ? "drop-shadow(0 0 6px #FFD600)" : "none",
                    transition: "opacity 0.2s, color 0.2s"
                }}
                title="Modo claro"
            >
                <FaSun size={22} />
            </span>
            {/* Switch deslizante */}
            <button
                onClick={toggleTheme}
                style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    border: "none",
                    background: isDark ? "#222" : "#FFD600",
                    position: "relative",
                    transition: "background 0.2s",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                    cursor: "pointer"
                }}
                aria-label="Cambiar tema"
            >
                <span
                    style={{
                        position: "absolute",
                        left: isDark ? 22 : 2,
                        top: 2,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: isDark ? "#90caf9" : "#fff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                        transition: "left 0.2s, background 0.2s"
                    }}
                />
            </button>
            {/* Luna */}
            <span
                style={{
                    opacity: isDark ? 1 : 0.4,
                    color: isDark ? "#90caf9" : "#bbb",
                    filter: isDark ? "drop-shadow(0 0 6px #90caf9)" : "none",
                    transition: "opacity 0.2s, color 0.2s"
                }}
                title="Modo oscuro"
            >
                <FaMoon size={22} />
            </span>
        </div>
    );
};

export default Switch;