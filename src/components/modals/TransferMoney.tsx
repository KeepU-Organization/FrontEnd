import { useEffect, useRef, useState } from 'react';
import { Modal as BSModal } from 'bootstrap';
import "./Modal.scss"
import 'bootstrap';
import { useAuth } from "../../hooks/UseAuth.tsx";
import { useForm } from 'react-hook-form';
import { walletService } from "../../services/WalletService.tsx";
import { useWallets } from "../../hooks/UseWallets.tsx";
import Toast from "../Toast.tsx";
import {CreateTransferRequest} from "../../types/Transactions.tsx";

interface ModalProps {
    id: string;
    title: string;
    show?: boolean;
    onClose?: () => void;
    childId?: number;
    childName?: string; // Añadido para evitar errores
}

type FormData = {
    receiverWalletId: string;
    transactionAmount: number;
}

const TransferMoneyModal = ({ id, title, show = false, onClose, childId, childName }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const modalInstanceRef = useRef<BSModal | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const [apiError, setApiError] = useState<string | null>(null);
    const { wallets, fetchChildrenWallets, childWallets } = useWallets();

    const [selectedWalletId, setSelectedWalletId] = useState<string>('');
    const [toast, setToast] = useState({
        show: false,
        message: '',
        title: '',
        type: 'success' as 'success' | 'danger' | 'warning' | 'info'
    });
    const showToast = (title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success') => {
        setToast({
            show: true,
            title,
            message,
            type
        });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        mode: 'onTouched',
        defaultValues: {
            transactionAmount: 0
        }
    });

    useEffect(() => {
        if (childId) {
            const childIdNumber = parseInt(childId.toString(), 10);
            if (!isNaN(childIdNumber) && user) {
                fetchChildrenWallets(childIdNumber);
            }
        }
    }, [childId, user, fetchChildrenWallets]);

    useEffect(() => {
        if (childWallets.length > 0) {
            setSelectedWalletId(childWallets[0].walletId);
        }
    }, [childWallets]);

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

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setApiError(null); // Limpiar errores previos

        try {
            const createTransferRequest:CreateTransferRequest={
                senderWalletId: wallets[0].walletId,
                receiverWalletId: selectedWalletId,
                transactionAmount: data.transactionAmount
            }
            const response = await walletService.transferToChildrenWallet(
                createTransferRequest
            );

            // Mostrar mensaje de éxito con el Toast
            showToast(
                '¡Transferencia Exitosa!',
                `Has transferido S/.${data.transactionAmount} correctamente.`,
                'success'
            );

            console.log('Datos enviados correctamente:', response);

            // Retrasar el cierre del modal para que el Toast sea visible
            setTimeout(() => {
                if (modalInstanceRef.current) {
                    modalInstanceRef.current.hide();
                }
            }, 2000);

        } catch(error: unknown) {
            console.log('Error en la transferencia: ', error);

            // Manejar el error y mostrar el Toast
            if (error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' && 'data' in error.response) {

                const data = error.response.data;
                const errorMessage = typeof data === 'object' && data && 'message' in data ?
                    data.message as string : 'Error en la transferencia';

                setApiError(errorMessage);
                showToast('Error en la transferencia', errorMessage, 'danger');

            } else if (error instanceof Error) {
                setApiError(error.message);
                showToast('Error', error.message, 'danger');
            } else {
                setApiError('Ha ocurrido un error durante la transferencia');
                showToast('Error', 'Ha ocurrido un error durante la transferencia', 'danger');
            }
        } finally {
            setIsLoading(false);
        }
    };

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
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-primary bg-gradient text-white">
                        <div>
                            <h5 className="modal-title fw-bold" id={`${id}-label`}>
                                <i className="bi bi-cash-coin me-2"></i>{title}
                            </h5>
                            {childName && (
                                <p className="modal-subtitle mb-0 text-white-50">
                                    <i className="bi bi-person me-1"></i>Transferir a: <span className="fw-bold">{childName}</span>
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Cuerpo del modal con fondo y texto adaptables */}
                    <div className="modal-body p-4" style={{ backgroundColor: 'var(--bs-body-bg)', color: 'var(--bs-body-color)' }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="card mb-4 border-0" style={{ backgroundColor: 'var(--bs-card-bg)' }}>
                                <div className="card-body p-3">
                                    <h6 className="card-subtitle mb-3" style={{ color: 'var(--bs-secondary-color)' }}>
                                        <i className="bi bi-wallet2 me-2"></i>Información de transferencia
                                    </h6>

                                    <div className="mb-4">
                                        <label htmlFor="wallet-select" className="form-label">
                                            Selecciona billetera del destinatario
                                        </label>
                                        <select
                                            className="form-select form-select-lg border-0 shadow-sm"
                                            id="wallet-select"
                                            value={selectedWalletId}
                                            onChange={(e) => setSelectedWalletId(e.target.value)}
                                        >
                                            <option value="">Selecciona una billetera</option>
                                            {childWallets && childWallets.length > 0 ? (
                                                childWallets.map(wallet => (
                                                    <option key={wallet.walletId} value={wallet.walletId}>
                                                        {wallet.walletType}: {wallet.walletId}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">No hay billeteras disponibles</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="transactionAmount" className="form-label">Monto a transferir:</label>
                                        <div className="input-group input-group-lg">
                                        <span
                                            className="input-group-text border-0 shadow-sm"
                                            style={{ backgroundColor: 'var(--bs-secondary-bg)' }}
                                        >
                                            S/.
                                        </span>
                                            <input
                                                type="number"
                                                className={`form-control border-0 shadow-sm ${errors.transactionAmount ? 'is-invalid' : ''}`}
                                                id="transactionAmount"
                                                placeholder="0.00"
                                                {...register('transactionAmount', {
                                                    required: 'El monto es obligatorio',
                                                    min: {
                                                        value: 1,
                                                        message: 'El monto debe ser mayor a 0'
                                                    }
                                                })}
                                            />
                                        </div>
                                        {errors.transactionAmount && (
                                            <div className="invalid-feedback d-block">
                                                <i className="bi bi-exclamation-triangle me-1"></i>
                                                {errors.transactionAmount.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {apiError && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    <div>{apiError}</div>
                                </div>
                            )}

                            <div className="d-grid gap-2 mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Realizando transacción...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-send-fill me-2"></i>
                                            Transferir Ahora
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Toast para notificaciones */}
            <Toast
                show={toast.show}
                onClose={hideToast}
                title={toast.title}
                message={toast.message}
                type={toast.type}
            />
        </div>
    );
};

export default TransferMoneyModal;