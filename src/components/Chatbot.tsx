import React, { useState } from 'react';
import { ChatMessageService } from '../services/ChatBotService';
import { useTheme } from '../ThemeContext';

const palettes = {
    light: {
        primary: '#1976d2',
        secondary: '#e3eaf2',
        bgGradient: 'linear-gradient(135deg, #f7fafd 60%, #e3eaf2 100%)',
        text: '#222b45',
        inputBg: '#f5f7fa',
        border: '#b0bec5',
        white: '#fff',
        gray: '#90a4ae',
    },
    dark: {
        primary: '#90caf9',
        secondary: '#263238',
        bgGradient: 'linear-gradient(135deg, #23272f 60%, #37474f 100%)',
        text: '#f5f7fa',
        inputBg: '#263238',
        border: '#90a4ae',
        white: '#23272f',
        gray: '#b0bec5',
    }
};

const Chatbot = () => {
    const { theme } = useTheme();
    const palette = palettes[theme === 'dark' ? 'dark' : 'light'];

    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ from: 'user' | 'bot', text: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages(msgs => [...msgs, { from: 'user', text: input }]);
        setLoading(true);
        try {
            const response = await ChatMessageService.sendChatMessage(input);
            let botMsg = response || 'No puedo responder.';
            if (botMsg === 'No puedo responder.') {
                botMsg = 'Lo siento, no tengo una respuesta para eso. ¿Quieres preguntar otra cosa?';
            }
            setMessages(msgs => [...msgs, { from: 'bot', text: botMsg }]);
        } catch {
            setMessages(msgs => [...msgs, { from: 'bot', text: 'Error de conexión. Intenta de nuevo.' }]);
        }
        setInput('');
        setLoading(false);
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            fontFamily: 'Segoe UI, Arial, sans-serif',
        }}>
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: palette.bgGradient,
                        color: palette.primary,
                        border: 'none',
                        boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
                        fontSize: 36,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s',
                        outline: 'none',
                    }}
                    title="Abrir Chatbot"
                >
                    🤖
                </button>
            )}
            {open && (
                <div style={{
                    width: 400,
                    maxWidth: '98vw',
                    background: palette.bgGradient,
                    borderRadius: 20,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.3s',
                    border: `2px solid ${palette.border}`,
                    minHeight: 420,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontWeight: 700, color: palette.primary, fontSize: 22, letterSpacing: 1 }}>🤖 Chatbot</span>
                        <button
                            onClick={() => setOpen(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: 28,
                                color: palette.gray,
                                cursor: 'pointer',
                                fontWeight: 700,
                                transition: 'color 0.2s',
                                outline: 'none',
                            }}
                            title="Cerrar"
                        >
                            ×
                        </button>
                    </div>
                    <div style={{
                        flex: 1,
                        minHeight: 200,
                        maxHeight: 350,
                        overflowY: 'auto',
                        marginBottom: 12,
                        background: palette.white,
                        borderRadius: 14,
                        padding: 14,
                        fontSize: 17,
                        boxShadow: '0 2px 8px rgba(33,150,243,0.09)',
                        border: `1.5px solid ${palette.secondary}`,
                        color: palette.text,
                        transition: 'box-shadow 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                    }}>
                        {messages.length === 0 && (
                            <div style={{ color: palette.gray, textAlign: 'center', marginTop: 30, fontSize: 18 }}>
                                ¡Hola! ¿En qué puedo ayudarte hoy?
                            </div>
                        )}
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-end',
                                animation: 'fadeMsg 0.25s',
                            }}>
                                <span style={{
                                    background: msg.from === 'user'
                                        ? palette.primary
                                        : palette.secondary,
                                    color: msg.from === 'user'
                                        ? '#fff'
                                        : palette.text,
                                    borderRadius: msg.from === 'user'
                                        ? '18px 18px 6px 18px'
                                        : '18px 18px 18px 6px',
                                    padding: '14px 22px',
                                    maxWidth: '75%',
                                    wordBreak: 'break-word',
                                    fontWeight: 500,
                                    fontSize: 17,
                                    boxShadow: '0 4px 16px rgba(33,150,243,0.10)',
                                    border: msg.from === 'user'
                                        ? `2px solid ${palette.primary}`
                                        : `2px solid ${palette.border}`,
                                    marginBottom: 4,
                                    transition: 'background 0.2s, box-shadow 0.2s',
                                    position: 'relative',
                                }}>
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                        {loading && <div style={{ color: palette.gray, fontStyle: 'italic', marginTop: 6 }}>Escribiendo...</div>}
                    </div>
                    <form onSubmit={sendMessage} style={{ display: 'flex', gap: 10 }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Escribe tu pregunta..."
                            style={{
                                flex: 1,
                                borderRadius: 10,
                                border: `1.5px solid ${palette.primary}`,
                                padding: '12px 14px',
                                fontSize: 16,
                                outline: 'none',
                                background: palette.inputBg,
                                color: palette.text,
                                transition: 'border 0.2s',
                            }}
                            disabled={loading}
                            autoFocus
                        />
                        <button
                            type="submit"
                            style={{
                                background: palette.primary,
                                color: '#fff',
                                border: 'none',
                                borderRadius: 10,
                                padding: '12px 22px',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontSize: 16,
                                boxShadow: '0 2px 8px rgba(33,150,243,0.13)',
                                transition: 'background 0.2s',
                                outline: 'none',
                            }}
                            disabled={loading}
                        >
                            Enviar
                        </button>
                    </form>
                </div>
            )}
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                @keyframes fadeMsg {
                    from { opacity: 0; transform: translateY(20px);}
                    to { opacity: 1; transform: translateY(0);}
                }
                `}
            </style>
        </div>
    );
};

export default Chatbot;