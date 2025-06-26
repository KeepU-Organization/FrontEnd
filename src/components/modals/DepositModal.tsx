import { useEffect, useRef, useState } from 'react';
import { Modal as BSModal } from 'bootstrap';
import "./Modal.scss"
import 'bootstrap';
import { useForm } from 'react-hook-form';
import {useWallets} from "../../hooks/UseWallets.tsx";
import PayPalButton from "../buttons/PayPalButton.tsx";

interface ModalProps {
    id: string;
    title: string;
    show?: boolean;
    onClose?: () => void;
}

type FormData = {
    monto: string;
}

const DepositModal = ({ id, title, show = false, onClose }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const modalInstanceRef = useRef<BSModal | null>(null);
    const [backendError, setBackendError] = useState<string | null>(null);
    const [monto, setMonto] = useState<string>('');

    const [selectedWalletId, setSelectedWalletId] = useState<string>('');
    //obtener wallet:
    const {wallets} = useWallets();

    // Configuración de react-hook-form
    const {
        register,
        formState: { errors },
    } = useForm<FormData>({
        mode: 'onTouched',
        defaultValues: {
            monto: '',
        }
    });

    const handlePaymentError = (errorMessage: string) => {
        setBackendError(errorMessage);
    };
    useEffect(() => {
        if (backendError) {
            setBackendError(null);
        }
    }, [backendError, monto, selectedWalletId]);

    useEffect(() => {
        if (wallets.length > 0 && !selectedWalletId) {
            setSelectedWalletId(wallets[0].walletId);
        }
        console.log("Wallets:", wallets);
    }, [wallets, selectedWalletId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Permitir solo números, punto decimal y vacío
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setMonto(value);
        }
    };

    const handlePresetAmount = (amount: number) => {
        setMonto(amount.toString());
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initModal = () => {
            if (!modalRef.current) return;

            if (!modalInstanceRef.current) {
                modalInstanceRef.current = new BSModal(modalRef.current);

                if (onClose) {
                    modalRef.current.addEventListener('hidden.bs.modal', onClose);
                }
            }

            if (show) {
                modalInstanceRef.current.show();
            } else if (modalInstanceRef.current) {
                modalInstanceRef.current.hide();
            }
        };

        const timer = setTimeout(() => {
            initModal();
        }, 0);

        return () => {
            clearTimeout(timer);

            if (modalRef.current && onClose) {
                modalRef.current.removeEventListener('hidden.bs.modal', onClose);
            }

            if (modalInstanceRef.current) {
                modalInstanceRef.current.dispose();
                modalInstanceRef.current = null;
            }
        };
    }, [id, show, onClose]);


    return (
        <div
            className="modal fade"
            id={id}
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby={`${id}-label`}
            aria-hidden="true"
            ref={modalRef}
        >
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id={`${id}-label`}>{title}</h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">


                        <form >
                            {/* Campo para el monto */}
                            <div className="mb-3">
                                <input
                                    type="text"
                                    {...register('monto', { required: true })}
                                    value={monto}
                                    onChange={handleInputChange}
                                    placeholder="Monto en Soles (S/)"
                                    className={`form-control ${errors.monto ? 'is-invalid' : ''}`}
                                />
                                {errors.monto && (
                                    <div className="invalid-feedback">Este campo es obligatorio</div>
                                )}
                            </div>

                            {/* Dropdown para seleccionar wallet */}
                            <div className="mb-3">
                                <label htmlFor="wallet-select" className="form-label">Selecciona tu billetera</label>
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

                            {/* Botones de monto predefinido */}
                            <div className="d-grid gap-2 mb-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handlePresetAmount(25)}
                                >
                                    S/ 25
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handlePresetAmount(50)}
                                >
                                    S/ 50
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary"
                                    onClick={() => handlePresetAmount(100)}
                                >
                                    S/ 100
                                </button>
                            </div>

                            {backendError && (
                                <div className="alert alert-danger" role="alert">
                                    {backendError}
                                </div>
                            )}
                            {/* Mensaje de advertencia si no hay wallet seleccionada o monto vacío */}
                            {(!selectedWalletId || !monto) && (
                                <div className="alert alert-warning" role="alert">
                                    Por favor, selecciona una billetera e ingresa un monto para continuar.
                                </div>
                            )}

                            {/* PayPal Button */}
                            {selectedWalletId && monto ? (
                                <PayPalButton
                                    walletId={selectedWalletId}
                                    amount={parseFloat(monto)}
                                    onPaymentError={handlePaymentError}
                                />
                            ) : (
                                <p className="text-warning">Selecciona una billetera e ingresa un monto para continuar</p>
                            )}
                        </form>

                </div>
            </div>
        </div>
        </div>
    );
};

export default DepositModal;