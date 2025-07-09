import { useWallets } from "../../../hooks/UseWallets.tsx";
import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar.tsx";
import "./HomeChildren.scss";
import robotBadge from '../../../assets/robot_badge.png';
import dollBadge from '../../../assets/doll_badge.png';
import premiumBadge from '../../../assets/premium_badge.png';
import robloxCard from '../../../assets/roblox_card.png';

const MEDALLAS = [
    { img: robotBadge, nombre: "Meta Alcanzada", progreso: 60, color: "#ffd700" },
    { img: dollBadge, nombre: "Cazador de Ofertas", progreso: 40, color: "#4dd0e1" },
    { img: premiumBadge, nombre: "Ahorro Inteligente", progreso: 80, color: "#81c784" },
    { icon: "🎁", nombre: "Canjear medallas", progreso: 100, color: "#f06292", canjear: true }
];

const NOTICIAS = [
    { img: robloxCard, texto: "20% de descuento", alt: "Roblox" },
    { icon: "📖", texto: "Nuevo material para revisar" }
];

const HomeChildren = () => {
    const [selectedWalletId, setSelectedWalletId] = useState<string>('');
    const { wallets } = useWallets();
    const [balance, setBalance] = useState<string>('0');

    useEffect(() => {
        if (selectedWalletId) {
            const selectedWallet = wallets.find(wallet => wallet.walletId === selectedWalletId);
            if (selectedWallet) setBalance(selectedWallet.balance);
        } else if (wallets.length > 0) {
            setBalance(wallets[0].balance);
            setSelectedWalletId(wallets[0].walletId);
        }
    }, [selectedWalletId, wallets]);

    return (
        <>
            <Navbar />
            <main className="home-children-main">
                {/* Buscador y saldo */}
                <section className="hc-section glass">
                    <div className="search-balance-row">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="search-input"
                                aria-label="Buscar"
                            />
                            <span className="search-icon" aria-hidden>🔍</span>
                        </div>
                        <button className="saldo-btn pulse">
                            <span role="img" aria-label="Dinero">💰</span> SALDO
                        </button>
                    </div>
                </section>

                {/* Monto y billetera */}
                <section className="hc-section glass wallet-section">
                    <div className="wallet-row">
                        <div className="wallet-balance-card">
                            <span className="wallet-balance-icon">👛</span>
                            <div>
                                <div className="wallet-balance-label">Monto disponible</div>
                                <div className="wallet-balance-amount">s/. <b>{balance}</b></div>
                            </div>
                        </div>
                        <div className="wallet-select-box">
                            <label htmlFor="wallet-select" className="wallet-select-label">
                                <span className="wallet-select-label-icon">💳</span> Selecciona tu billetera
                            </label>
                            <div className="wallet-select-wrapper">
                                <select
                                    className="wallet-select"
                                    id="wallet-select"
                                    value={selectedWalletId}
                                    onChange={e => setSelectedWalletId(e.target.value)}
                                >
                                    <option value="">Elige una billetera</option>
                                    {wallets.map(wallet => (
                                        <option key={wallet.walletId} value={wallet.walletId}>
                                            {wallet.walletType}: {wallet.walletId}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Medallas */}
                <section className="hc-section medallas-section glass">
                    <h3 className="medallas-title">Medallas en progreso</h3>
                    <div className="medallas-list">
                        {MEDALLAS.map((medalla) => (
                            <div
                                className={`medalla-card${medalla.canjear ? " canjear" : ""}`}
                                key={medalla.nombre}
                                style={{ borderColor: medalla.color }}
                            >
                                <div className="medalla-icon" style={{ color: medalla.color }}>
                                    {medalla.img
                                        ? <img src={medalla.img} alt={medalla.nombre} className="medalla-img" />
                                        : medalla.icon}
                                </div>
                                <div className="medalla-nombre">{medalla.nombre}</div>
                                <div className="medalla-barra">
                                    <div
                                        className="medalla-barra-progreso"
                                        style={{
                                            width: `${medalla.progreso}%`,
                                            background: medalla.canjear
                                                ? "linear-gradient(90deg,#f06292 60%,#ffd54f 100%)"
                                                : `linear-gradient(90deg,${medalla.color} 60%,#ffd54f 100%)`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Noticias */}
                <section className="hc-section noticias-section glass">
                    <h3 className="noticias-title">Noticias</h3>
                    <div className="noticias-carrusel">
                        {NOTICIAS.map((noticia, idx) => (
                            <div className="noticia-card" key={idx}>
                                {noticia.img ? (
                                    <img src={noticia.img} alt={noticia.alt} className="noticia-img" />
                                ) : (
                                    <div className="noticia-icono">{noticia.icon}</div>
                                )}
                                <div className="noticia-texto">{noticia.texto}</div>
                                <button className="noticia-flecha" aria-label="Ver más">&#8594;</button>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
};

export default HomeChildren;