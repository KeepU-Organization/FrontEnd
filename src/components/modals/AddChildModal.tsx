import { useEffect, useRef, useState } from 'react';
import { Modal as BSModal } from 'bootstrap';
import "./Modal.scss"
import 'bootstrap';
import {addChildService} from "../../services/AddChildService.tsx";
import {useAuth} from "../../hooks/UseAuth.tsx";
import { useForm } from 'react-hook-form';

interface ModalProps {
    id: string;
    title: string;
    show?: boolean;
    onClose?: () => void;
}

type FormData = {
    childName: string;
    childLastName: string;
    childAge: number;
}

const AddChildModal = ({ id, title, show = false, onClose }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const modalInstanceRef = useRef<BSModal | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {user} = useAuth();

    const [apiError, setApiError] = useState<string | null>(null);
    const [showCode, setShowCode] = useState(false);
    const [code, setCode] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(err => {
                console.error('Error al copiar: ', err);
            });
    };

    // Configuración de react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        mode: 'onTouched',
        defaultValues: {
            childName: '',
            childLastName: '',
            childAge: 0
        }
    });

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;

        if (timeRemaining > 0) {
            timer = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [timeRemaining]);

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
        try {
            const response = await addChildService.createInvitationCode({
                userId: user?.id || 0,
                childName: data.childName,
                childLastName: data.childLastName,
                childAge: data.childAge,
            });
            console.log('Datos enviados correctamente:', response);

            // Convertir el código a string para poder mostrarlo dígito por dígito
            setCode(response.code.toString());
            setShowCode(true);

            setTimeRemaining(60); // 60 segundos de espera
        } catch(error: unknown) {
            console.log('error en el registro: ', error);

            if (error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' && 'data' in error.response) {

                const data = error.response.data;
                setApiError(typeof data === 'object' && data && 'message' in data ?
                    data.message as string : 'Error en el registro');
            } else if (error instanceof Error) {
                setApiError(error.message);
            } else {
                setApiError('Ha ocurrido un error durante el registro');
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
                        <h5 className="modal-title fw-bold" id={`${id}-label`}>
                            <i className="bi bi-person-plus-fill me-2"></i>{title}
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="card mb-4 bg-light border-0">
                                <div className="card-body p-3">
                                    <h6 className="card-subtitle mb-3 text-muted">
                                        <i className="bi bi-info-circle me-2"></i>Información del hijo
                                    </h6>

                                    <div className="mb-3">
                                        <label htmlFor="childName" className="form-label">Nombre del hijo</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-0 shadow-sm">
                                                <i className="bi bi-person"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className={`form-control border-0 shadow-sm ${errors.childName ? 'is-invalid' : ''}`}
                                                id="childName"
                                                placeholder="Ingrese el nombre del hijo"
                                                {...register('childName', {
                                                    required: 'El nombre es obligatorio'
                                                })}
                                            />
                                        </div>
                                        {errors.childName && (
                                            <div className="invalid-feedback d-block">
                                                <i className="bi bi-exclamation-triangle me-1"></i>
                                                {errors.childName.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="childLastName" className="form-label">Apellidos del hijo</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-0 shadow-sm">
                                                <i className="bi bi-person-badge"></i>
                                            </span>
                                            <input
                                                type="text"
                                                className={`form-control border-0 shadow-sm ${errors.childLastName ? 'is-invalid' : ''}`}
                                                id="childLastName"
                                                placeholder="Ingrese el apellido del hijo"
                                                {...register('childLastName', {
                                                    required: 'El apellido es obligatorio'
                                                })}
                                            />
                                        </div>
                                        {errors.childLastName && (
                                            <div className="invalid-feedback d-block">
                                                <i className="bi bi-exclamation-triangle me-1"></i>
                                                {errors.childLastName.message}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="childAge" className="form-label">Edad del hijo</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-0 shadow-sm">
                                                <i className="bi bi-calendar3"></i>
                                            </span>
                                            <input
                                                type="number"
                                                className={`form-control border-0 shadow-sm ${errors.childAge ? 'is-invalid' : ''}`}
                                                id="childAge"
                                                placeholder="Ingrese la edad del hijo"
                                                {...register('childAge', {
                                                    required: 'La edad es obligatoria',
                                                    min: {
                                                        value: 1,
                                                        message: 'La edad debe ser mayor a 0'
                                                    }
                                                })}
                                            />
                                        </div>
                                        {errors.childAge && (
                                            <div className="invalid-feedback d-block">
                                                <i className="bi bi-exclamation-triangle me-1"></i>
                                                {errors.childAge.message}
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

                            {showCode ? (
                                <div className="card mt-4 border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="m-0 text-primary">
                                                <i className="bi bi-qr-code me-2"></i>
                                                Código de invitación
                                            </h5>
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-primary'}`}
                                                onClick={copyToClipboard}
                                            >
                                                <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'} me-1`}></i>
                                                {copied ? 'Copiado' : 'Copiar código'}
                                            </button>
                                        </div>

                                        <div className="d-flex justify-content-center align-items-center my-3">
                                            {[...code].map((digit, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-light rounded shadow-sm mx-1 d-flex justify-content-center align-items-center"
                                                    style={{
                                                        width: '3.5rem',
                                                        height: '4rem',
                                                    }}
                                                >
                                                    <span className="fs-2 fw-bold text-primary">{digit}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="text-center text-muted">
                                            <small>
                                                <i className="bi bi-clock me-1"></i>
                                                El código expirará en {timeRemaining} segundos
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-grid gap-2 mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={isLoading || timeRemaining > 0}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Generando código...
                                            </>
                                        ) : timeRemaining > 0 ? (
                                            <>
                                                <i className="bi bi-hourglass-split me-2"></i>
                                                Espera {timeRemaining}s
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-key-fill me-2"></i>
                                                Generar código de invitación
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
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddChildModal;