import { useEffect, useRef, useState } from 'react';
import { Modal as BSModal } from 'bootstrap';
import ConfirmationCodeInput from '../VerifCode';
import { useAuth } from '../../hooks/UseAuth';
import { securityKeyService } from '../../services/SecurityKeyService';

interface ChangeSecurityKeyModalProps {
    id: string;
    title: string;
    show?: boolean;
    onClose?: () => void;
}

const ChangeSecurityKeyModal = ({ id, title, show = false, onClose }: ChangeSecurityKeyModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const modalInstanceRef = useRef<BSModal | null>(null);

    const { user } = useAuth();
    const [step, setStep] = useState<1 | 2>(1);
    const [currentKey, setCurrentKey] = useState('');
    const [currentKeyError, setCurrentKeyError] = useState<string | null>(null);
    const [newKey, setNewKey] = useState('');
    const [newKeyError, setNewKeyError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initModal = () => {
            if (!modalRef.current) return;

            if (!modalInstanceRef.current) {
                modalInstanceRef.current = new BSModal(modalRef.current);

                if (onClose) {
                    modalRef.current.addEventListener('hidden.bs.modal', handleClose);
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
                modalRef.current.removeEventListener('hidden.bs.modal', handleClose);
            }

            if (modalInstanceRef.current) {
                modalInstanceRef.current.dispose();
                modalInstanceRef.current = null;
            }
        };
        // eslint-disable-next-line
    }, [id, show, onClose]);

    const handleClose = () => {
        setStep(1);
        setCurrentKey('');
        setCurrentKeyError(null);
        setNewKey('');
        setNewKeyError(null);
        setMessage(null);
        setLoading(false);
        if (onClose) onClose();
    };

    // Paso 1: Verificar código actual
    const handleVerifyCurrentKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentKeyError(null);
        setLoading(true);
        try {
            if (!user) throw new Error('Usuario no autenticado');
            const isValid = await securityKeyService.checkSecurityKey(user.email, currentKey);
            if (!isValid) throw new Error('Código de seguridad incorrecto');
            setStep(2);
        } catch (err: any) {
            setCurrentKeyError(err.message || 'Código de seguridad incorrecto');
        } finally {
            setLoading(false);
        }
    };

    // Paso 2: Cambiar clave
    const handleChangeKey = async () => {
        setNewKeyError(null);
        setLoading(true);
        setMessage(null);
        try {
            if (!user) throw new Error('Usuario no autenticado');
            if (!/^\d{6}$/.test(newKey)) throw new Error('La nueva clave debe tener 6 dígitos numéricos');
            const res = await securityKeyService.changeSecurityKey(user.id, currentKey, newKey);
            setMessage(typeof res === 'string' ? res : 'Clave cambiada correctamente');
        } catch (err: any) {
            setNewKeyError(err.message || 'Error al cambiar la clave.');
        } finally {
            setLoading(false);
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
                        {step === 1 && (
                            <form onSubmit={handleVerifyCurrentKey}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Ingresa tu código de seguridad actual
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={currentKey}
                                        onChange={e => setCurrentKey(e.target.value)}
                                        maxLength={15}
                                        disabled={loading}
                                    />
                                    <div className="form-text">
                                        Recuerda que por defecto al inicio es igual a tu contraseña.
                                    </div>
                                    {currentKeyError && (
                                        <div className="alert alert-danger mt-2">{currentKeyError}</div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary" disabled={loading || !currentKey}>
                                        {loading ? 'Verificando...' : 'Continuar'}
                                    </button>
                                </div>
                            </form>
                        )}
                        {step === 2 && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Ingresa tu nueva clave de seguridad (6 dígitos)
                                    </label>
                                    <ConfirmationCodeInput
                                        length={6}
                                        onComplete={code => setNewKey(code)}
                                    />
                                    {newKeyError && (
                                        <div className="alert alert-danger mt-2">{newKeyError}</div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button
                                        className="btn btn-secondary me-2"
                                        onClick={handleClose}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={handleChangeKey}
                                        disabled={loading || newKey.length !== 6}
                                    >
                                        {loading ? 'Guardando...' : 'Cambiar clave'}
                                    </button>
                                </div>
                                {message && (
                                    <div className={`alert mt-3 ${message.includes('correctamente') ? 'alert-success' : 'alert-info'}`}>
                                        {message}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeSecurityKeyModal;