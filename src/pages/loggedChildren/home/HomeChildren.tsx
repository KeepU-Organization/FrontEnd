import { useWallets } from "../../../hooks/UseWallets.tsx";
import { useEffect, useState } from "react";
import ChangeSecurityKeyModal from '../../../components/modals/ChangeSecurityKeyModal.tsx';

const HomeChildren = () => {
    const [selectedWalletId, setSelectedWalletId] = useState<string>('');
    const { wallets } = useWallets();
    const [balance, setBalance] = useState<string>('0');
    const [showSecurityKeyModal, setShowSecurityKeyModal] = useState(false);

    useEffect(() => {
        if (selectedWalletId) {
            const selectedWallet = wallets.find(wallet => wallet.walletId === selectedWalletId);
            if (selectedWallet) {
                setBalance(selectedWallet.balance);
            }
        } else if (wallets.length > 0) {
            setBalance(wallets[0].balance);
            setSelectedWalletId(wallets[0].walletId);
        }
    }, [selectedWalletId, wallets]);

    return (
        <div className="container-fluid p-4" style={{ marginTop: '80px' }}>
            {/* Primera fila: Monto, botones */}
            <div className="row mb-4 align-items-center">
                <div className="col-auto">
                    <div className="bg-info bg-opacity-25 border border-info rounded-pill px-4 py-2 d-flex align-items-center">
                        <span className="me-3 fw-semibold">
                            Monto: s/.{balance}
                        </span>
                        <button
                            className="btn btn-outline-secondary ms-2"
                            onClick={() => setShowSecurityKeyModal(true)}
                        >
                            Clave de Seguridad
                        </button>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="wallet-select" className="form-label">Billetera</label>
                    <select
                        className="form-select"
                        id="wallet-select"
                        value={selectedWalletId}
                        onChange={(e) => setSelectedWalletId(e.target.value)}
                    >
                        <option value="">Selecciona una billetera</option>
                        {wallets.map(wallet => (
                            <option key={wallet.walletId} value={wallet.walletId}>
                                {wallet.walletType}: {wallet.walletId}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Modal para cambiar la clave de seguridad */}
            <ChangeSecurityKeyModal
                show={showSecurityKeyModal}
                onClose={() => setShowSecurityKeyModal(false)}
                id="changeSecurityKeyModal"
                title="Cambiar Clave de Seguridad"
            />
        </div>
    );
};

export default HomeChildren;