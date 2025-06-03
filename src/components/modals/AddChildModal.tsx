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
                <div className="modal-content">
                    {/* Header sin cambios */}
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Campos del formulario sin cambios */}
                            <div className="mb-3">
                                <label htmlFor="childName" className="form-label">Nombre del hijo</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.childName ? 'is-invalid' : ''}`}
                                    id="childName"
                                    placeholder="Ingrese el nombre del hijo"
                                    {...register('childName', {
                                        required: 'El nombre es obligatorio'
                                    })}
                                />
                                {errors.childName && (
                                    <div className="invalid-feedback">{errors.childName.message}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="childLastName" className="form-label">Apellidos del hijo</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.childLastName ? 'is-invalid' : ''}`}
                                    id="childLastName"
                                    placeholder="Ingrese el apellido del hijo"
                                    {...register('childLastName', {
                                        required: 'El apellido es obligatorio'
                                    })}
                                />
                                {errors.childLastName && (
                                    <div className="invalid-feedback">{errors.childLastName.message}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="childAge" className="form-label">Edad del hijo</label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.childAge ? 'is-invalid' : ''}`}
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
                                {errors.childAge && (
                                    <div className="invalid-feedback">{errors.childAge.message}</div>
                                )}
                            </div>

                            {apiError && (
                                <div className="alert alert-danger" role="alert">
                                    {apiError}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-outline-primary"
                                disabled={isLoading || timeRemaining > 0}
                            >
                                {isLoading
                                    ? 'Generando código...'
                                    : timeRemaining > 0
                                        ? `Espera ${timeRemaining}s`
                                        : 'Generar nuevo código'}
                            </button>

                            {showCode && (
                                <div className="mt-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="m-0">Código de invitación:</h5>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={copyToClipboard}
                                        >
                                            {copied ? '¡Copiado!' : 'Copiar código'}
                                        </button>
                                    </div>

                                    {/* Visualización del código como cuadros */}
                                    <div className="d-flex justify-content-center align-items-center mb-2">
                                        {[...code].map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength={1}
                                                className="form-control text-center mx-1"
                                                style={{
                                                    width: '3rem',
                                                    height: '3rem',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold'
                                                }}
                                                value={digit}
                                                readOnly
                                                ref={el => {
                                                    if (el) {
                                                        inputRefs.current[index] = el;
                                                    }
                                                }}
                                            />
                                        ))}
                                    </div>

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