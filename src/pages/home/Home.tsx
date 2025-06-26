import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../ThemeContext';
import Footer from '../../components/footer/Footer';

import piggy from '../../assets/landing-ahorro.png';

const integrantes = [
    { nombre: 'Salvador Dias ', rol: 'CEO', img: 'src/assets/Salvador_Diaz.png' },
    { nombre: 'Ricardor Rivas', rol: 'CEO', img: 'src/assets/Ricardo_Rivas.png' },
    { nombre: 'Diego Salinas', rol: 'CEO', img: 'src/assets/Diego_Salinas.png' },
    { nombre: 'Joaquin Arévalo', rol: 'CEO', img: 'src/assets/Joaquin_Arevalo.png' },
    { nombre: 'Sofía Miranda', rol: 'CEO', img: 'src/assets/Sofia_Miranda.png' },
];

const testimonios = [
    {
        nombre: 'Ana Rodríguez (mamá de Leo)',
        texto: 'Siempre quise enseñarle a Leo a ahorrar, pero no sabía cómo hacerlo de forma entretenida. Con Keep-u, ahora tenemos una rutina juntos donde él establece sus metas y yo puedo acompañarlo en cada paso. ¡Nos ha unido como familia!',
        img: 'src/assets/madre_familia.png',
    },
    {
        nombre: 'Leo Rodríguez (12 años)',
        texto: 'Antes solo guardaba mis monedas en una caja. Ahora con Keep-u, tengo metas, gano puntos y aprendí qué es un presupuesto. Ahorré para mi bici y ya estoy empezando con mi próxima meta. ¡Me siento más responsable!',
        img: 'src/assets/leo_niño.png',
    },
    {
        nombre: 'Martín Gutiérrez (papá y docente)',
        texto: 'Combinar educación y finanzas no es fácil, pero Keep-u lo logra. La app le da a mis hijos herramientas reales para entender el valor del dinero, mientras yo tengo control y visibilidad. ¡Es una solución pensada para las familias!',
        img: 'src/assets/martin_padre.png',
    },
    {
        nombre: 'Sofía Mena (15 años)',
        texto: 'Me encanta que puedo ver cómo crece mi ahorro, definir mis propias metas y aprender con retos. No parece una clase aburrida, es más como un juego que me enseña cosas útiles para mi futuro.',
        img: 'src/assets/sofia_niña.png',
    },
    {
        nombre: 'Dr. Julián Torres (Especialista en educación financiera infantil)',
        texto: 'Keep-u representa un gran avance en la alfabetización financiera temprana. Combina lo mejor del juego, la tecnología y la supervisión adulta para generar hábitos sólidos desde la infancia. Una herramienta valiosa para el presente y futuro de las nuevas generaciones.',
        img: 'src/assets/julian_especialista.png',
    },
];


const faqs = [
    {
        pregunta: '¿Qué es Keep-u?',
        respuesta: 'Es una app que ayuda a niños y adolescentes a aprender sobre dinero, mientras los padres supervisan y apoyan su progreso.',
    },
    {
        pregunta: '¿Mis hijos necesitan tarjeta o cuenta bancaria?',
        respuesta: 'No, todo se gestiona desde la app con una billetera virtual supervisada por sus padres.',
    },
    {
        pregunta: '¿Es segura la app?',
        respuesta: 'Sí, usamos contraseñas, PINs y autorizaciones parentales para mantener todo bajo control.',
    },
];

const features = [
    {
        icon: '🧩',
        title: 'Educación financiera',
        desc: 'Aprende jugando con módulos, desafíos y recompensas que enseñan a manejar el dinero.',
    },
    {
        icon: '👨‍👩‍👧',
        title: 'Supervisión parental',
        desc: 'Los padres asignan dinero, revisan avances y fomentan buenos hábitos desde casa.',
    },
    {
        icon: '🔐',
        title: 'Seguridad para todos',
        desc: 'Tu información está protegida con autenticación, control de accesos y cifrado.',
    },
];



const Home = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [testimonioIdx, setTestimonioIdx] = useState(0);
    const [faqOpen, setFaqOpen] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setTestimonioIdx((prev) => (prev === testimonios.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const colorPalettes = {
        light: {
            bg: 'linear-gradient(120deg, #e0f7fa 0%, #f5f0ec 50%, #fffde7 100%)',
            text: '#424242',
            heading1: '#00bcd4',
            heading2: '#ffb300',
            heading3: '#8bc34a',
            accent1: '#ffa726',
            accent2: '#00acc1',
            button: '#00bcd4',
            buttonHover: '#0097a7',
            card: '#fff',
            team: '#f7f7ff',
            testimonials: '#f7f7ff',
            faq: '#fff',
        },
        dark: {
            bg: 'linear-gradient(120deg, #23272f 0%, #263238 60%, #37474f 100%)',
            text: '#e0e0e0',
            heading1: '#4dd0e1',
            heading2: '#ffd54f',
            heading3: '#aed581',
            accent1: '#ffb74d',
            accent2: '#4dd0e1',
            button: '#4dd0e1',
            buttonHover: '#0097a7',
            card: '#23272f',
            team: '#23272f',
            testimonials: '#23272f',
            faq: '#23272f',
        }
    };

    const colors = colorPalettes[theme];

    // --- HERO STYLES ---
    const containerStyle: React.CSSProperties = {
        minHeight: 'calc(100vh - 80px - 120px)', // 80px navbar, 120px footer
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.bg,
        color: colors.text,
        transition: 'background 0.3s, color 0.3s',
        overflow: 'hidden',
        position: 'relative',
        paddingTop: '80px', // navbar
        paddingBottom: '0', // sin separación extra
    };

    const contentStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '1200px',
        gap: '3rem',
        padding: '3rem 2rem',
        zIndex: 2,
    };

    const leftStyle: React.CSSProperties = {
        flex: 1.2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 0,
        textAlign: 'center',
    };

    const headingStyle: React.CSSProperties = {
        fontSize: '3.2rem',
        fontWeight: 800,
        lineHeight: 1.1,
        marginBottom: '1.5rem',
        letterSpacing: '-1px',
    };

    const textStyle: React.CSSProperties = {
        fontSize: '1.3rem',
        marginBottom: '1.7rem',
        fontWeight: 500,
    };

    const formStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        marginTop: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
    };

    const inputStyle: React.CSSProperties = {
        flex: 1,
        minWidth: '200px',
        padding: '1rem 1.4rem',
        borderRadius: '999px',
        border: 'none',
        fontSize: '1.1rem',
        outline: 'none',
        background: 'rgba(255,255,255,0.7)',
        color: colors.text,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'background 0.3s, color 0.3s',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '1rem 2.5rem',
        borderRadius: '999px',
        background: colors.button,
        color: 'white',
        fontWeight: 700,
        border: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        fontSize: '1.15rem',
        transition: 'background 0.2s',
    };

    const rightStyle: React.CSSProperties = {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
    };

    const imageBoxStyle: React.CSSProperties = {
        width: '370px',
        height: '370px',
        borderRadius: '1.5rem',
        background: 'rgba(255,255,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
        overflow: 'hidden',
        transition: 'transform 0.3s',
    };

    // --- RESTO DE SECCIONES ---
    const featuresSection: React.CSSProperties = {
        width: '100%',
        maxWidth: 1100,
        display: 'flex',
        justifyContent: 'center',
        gap: '2.5rem',
        margin: '2.5rem 0 2rem 0',
        flexWrap: 'wrap',
    };

    const featureCard: React.CSSProperties = {
        background: colors.card,
        borderRadius: '1.5rem',
        boxShadow: '0 6px 24px rgba(124,42,232,0.07)',
        padding: '2.2rem 1.7rem',
        minWidth: 220,
        maxWidth: 320,
        textAlign: 'center',
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.13rem',
        fontWeight: 500,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    };

    const faqSectionStyle: React.CSSProperties = {
        width: '100%',
        maxWidth: 900,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '2.5rem',
        background: colors.faq,
        borderRadius: 18,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        padding: '2.5rem 2rem 2rem 2rem',
        margin: '0 auto 2.5rem auto',
    };

    const faqTitle: React.CSSProperties = {
        color: colors.heading2,
        fontSize: '2rem',
        fontWeight: 900,
        marginBottom: '1.2rem',
        letterSpacing: '-1px',
        minWidth: 270, // antes 220
    };

    const faqList: React.CSSProperties = {
        width: '100%',
        listStyle: 'none',
        padding: 0,
        margin: 0,
    };

    const faqItem: React.CSSProperties = {
        marginBottom: '1.1rem',
        fontSize: '1.13rem',
        color: colors.text,
        border: 'none',
        paddingBottom: 0,
        borderRadius: 12,
        boxShadow: '0 2px 10px rgba(0,172,193,0.07)',
        background: 'rgba(0,172,193,0.04)',
        transition: 'box-shadow 0.2s, background 0.2s',
    };

    const faqButtonStyle = (active: boolean): React.CSSProperties => ({
        width: '100%',
        background: 'none',
        border: `2px solid ${active ? colors.accent2 : '#b0bec5'}`,
        textAlign: 'left',
        padding: '0.8rem 0.8rem',
        fontSize: '1.08rem',
        fontWeight: 600,
        color: colors.text,
        cursor: 'pointer',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8,
        backgroundColor: active ? 'rgba(0,172,193,0.07)' : 'transparent',
        transition: 'background 0.2s, border 0.2s',
    });

    const sectionBase: React.CSSProperties = {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2.2rem 0.5rem 1.2rem 0.5rem',
        animation: 'fadeInUp 1s',
        boxSizing: 'border-box',
    };

    const testimonioCardStyle: React.CSSProperties = {
        background: colors.card,
        borderRadius: '1.5rem',
        boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
        padding: '2.2rem 1.2rem',
        margin: '0.7rem',
        minWidth: '340px', // antes 280px
        maxWidth: '540px', // antes 420px
        minHeight: '180px',
        textAlign: 'center',
        color: colors.text,
        fontSize: '1.15rem',
        transition: 'background 0.3s, color 0.3s, transform 0.2s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const integranteCardStyle: React.CSSProperties = {
        background: colors.card,
        borderRadius: '50%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.09)',
        padding: '1.2rem 0.7rem 1.7rem 0.7rem',
        margin: '0.5rem',
        minWidth: '120px',
        maxWidth: '140px',
        minHeight: '120px',
        textAlign: 'center',
        color: colors.text,
        fontSize: '1.05rem',
        transition: 'background 0.3s, color 0.3s, transform 0.2s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const avatarStyle: React.CSSProperties = {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '0.7rem',
        border: `3px solid ${colors.accent2}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    };

    // --- MEDIA QUERIES ---
    const mediaQuery = `
      @media (max-width: 900px) {
        .landing-content {
          flex-direction: column;
          gap: 2rem;
          padding: 2rem 1rem;
        }
        .landing-left, .landing-right {
          width: 100%;
          align-items: center;
          text-align: center;
        }
        .landing-right {
          margin-top: 1.5rem;
        }
        .features-section {
          flex-direction: column;
          gap: 1.5rem;
        }
        .faq-section {
          flex-direction: column;
          gap: 1.5rem;
          padding: 2rem 1rem;
        }
      }
      @media (max-width: 500px) {
        .landing-image-box {
          width: 220px !important;
          height: 220px !important;
        }
        h1 {
          font-size: 2rem !important;
        }
      }
      .feature-card:hover {
        transform: translateY(-8px) scale(1.04);
        box-shadow: 0 12px 32px rgba(124,42,232,0.13);
      }
      .card-hover:hover {
        transform: translateY(-8px) scale(1.03);
        box-shadow: 0 8px 32px rgba(0,0,0,0.13);
      }
      .testimonio-carrusel {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        position: relative;
      }
      .testimonio-arrow {
        background: none;
        border: none;
        font-size: 2rem;
        color: ${colors.accent2};
        cursor: pointer;
        padding: 0 0.5rem;
        transition: color 0.2s;
        user-select: none;
      }
      .testimonio-arrow:active {
        color: ${colors.accent1};
      }
      .testimonio-slide {
        min-width: 0;
        width: 100%;
        transition: opacity 0.4s, transform 0.4s;
        opacity: 1;
        transform: translateX(0);
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/signup');
    };

    return (
        <>
            <style>{mediaQuery}</style>
            <div style={containerStyle}>
                {/* HERO */}
                <div className="landing-content" style={contentStyle}>
                    <div className="landing-left" style={leftStyle}>
                        <h1 style={headingStyle}>
                            <span style={{ color: colors.heading1 }}>Tu futuro </span>
                            <span style={{ color: colors.heading2 }}>financiero </span>
                            <span style={{ color: colors.heading3 }}>empieza hoy.</span>
                        </h1>
                        <div style={textStyle}>
                            ¿Estás listo para cambiar tus hábitos?
                        </div>
                        <div style={{ marginBottom: '1.7rem', fontSize: '1.15rem' }}>
                            <div>
                                Ahorra con <span style={{ color: colors.accent1, fontWeight: 600 }}>intención.</span>
                            </div>
                            <div>
                                Vive con <span style={{ color: colors.accent2, fontWeight: 600 }}>libertad.</span>
                            </div>
                        </div>
                        <form style={formStyle} onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                style={inputStyle}
                                required
                            />
                            <button
                                type="submit"
                                style={buttonStyle}
                                onMouseOver={e => (e.currentTarget.style.background = colors.buttonHover)}
                                onMouseOut={e => (e.currentTarget.style.background = colors.button)}
                            >
                                ¡Pruébalo!
                            </button>
                        </form>
                    </div>
                    <div className="landing-right" style={rightStyle}>
                        <div
                            className="landing-image-box"
                            style={imageBoxStyle}
                            tabIndex={0}
                            aria-label="Cerdito ahorro"
                            onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                            onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <img
                                src={piggy}
                                alt="Cerdito"
                                style={{
                                    width: '85%',
                                    height: '85%',
                                    objectFit: 'contain',
                                    transition: 'transform 0.3s',
                                }}
                            />
                        </div>
                    </div>
                </div>
                {/* FUNCIONALIDADES */}
                <div className="features-section" style={featuresSection}>
                    {features.map((f, i) => (
                        <div key={i} className="feature-card" style={featureCard}>
                            <div style={{ fontSize: 44, marginBottom: 14 }}>{f.icon}</div>
                            <div style={{ fontWeight: 800, color: colors.heading2, marginBottom: 8, fontSize: '1.18rem' }}>{f.title}</div>
                            <div>{f.desc}</div>
                        </div>
                    ))}
                </div>
                {/* FAQ ACORDEÓN */}
                <section className="faq-section" style={faqSectionStyle}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingRight: 24 }}>
                        <div style={faqTitle}>Preguntas Frecuentes</div>
                        <div style={{ color: colors.text, fontSize: '1.08rem', textAlign: 'center', marginTop: 8 }}>
                            Encuentra la respuesta a tus preguntas aquí
                        </div>
                    </div>
                    <ul style={{ ...faqList, flex: 2 }}>
                        {faqs.map((faq, idx) => (
                            <li key={idx} style={faqItem}>
                                <button
                                    onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                                    style={faqButtonStyle(faqOpen === idx)}
                                    aria-expanded={faqOpen === idx}
                                >
                                    {faq.pregunta}
                                    <span style={{ fontSize: 18, marginLeft: 8 }}>
            {faqOpen === idx ? '▲' : '▼'}
          </span>
                                </button>
                                {faqOpen === idx && (
                                    <div style={{ padding: '0.5rem 0 0.7rem 0.5rem', color: colors.text, fontSize: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: 8 }}>
                                        {faq.respuesta}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
                {/* TESTIMONIOS */}
                <section style={{ ...sectionBase, background: colors.testimonials }}>
                    <h2 style={{ color: colors.heading1, fontSize: '1.7rem', fontWeight: 900, marginBottom: '1.2rem' }}>
                        Testimonios
                    </h2>
                    <div className="testimonio-carrusel">
                        <button className="testimonio-arrow" onClick={() => setTestimonioIdx(testimonioIdx === 0 ? testimonios.length - 1 : testimonioIdx - 1)} aria-label="Anterior">
                            &#8592;
                        </button>
                        <div className="testimonio-slide" key={testimonios[testimonioIdx].nombre}>
                            <div style={testimonioCardStyle} className="card-hover">
                                <img src={testimonios[testimonioIdx].img} alt={testimonios[testimonioIdx].nombre} style={avatarStyle} />
                                <div style={{ fontStyle: 'italic', marginBottom: '0.7rem' }}>"{testimonios[testimonioIdx].texto}"</div>
                                <div style={{ fontWeight: 700, color: colors.accent1 }}>{testimonios[testimonioIdx].nombre}</div>
                            </div>
                        </div>
                        <button className="testimonio-arrow" onClick={() => setTestimonioIdx(testimonioIdx === testimonios.length - 1 ? 0 : testimonioIdx + 1)} aria-label="Siguiente">
                            &#8594;
                        </button>
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 6, justifyContent: 'center' }}>
                        {testimonios.map((_, idx) => (
                            <span
                                key={idx}
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: idx === testimonioIdx ? colors.accent2 : '#ccc',
                                    display: 'inline-block',
                                    opacity: idx === testimonioIdx ? 1 : 0.4,
                                    transition: 'background 0.2s, opacity 0.2s',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setTestimonioIdx(idx)}
                            />
                        ))}
                    </div>
                </section>
                {/* INTEGRANTES */}
                <section style={{ ...sectionBase, background: colors.team }}>
                    <h2 style={{ color: colors.heading2, fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.2rem' }}>
                        Nuestro equipo
                    </h2>
                    <div className="cards-flex" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.7rem' }}>
                        {integrantes.map(i => (
                            <div key={i.nombre} style={integranteCardStyle} className="card-hover">
                                <img src={i.img} alt={i.nombre} style={avatarStyle} />
                                <div style={{ fontWeight: 800, fontSize: '1.08rem', marginBottom: '0.2rem', marginTop: 6 }}>{i.nombre}</div>
                                <div style={{ color: colors.accent2, fontSize: '0.98rem' }}>{i.rol}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </>

    );
};

export default Home;