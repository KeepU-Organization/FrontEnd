import { Link } from 'react-router';
//import { Navigate } from 'react-router-dom';
import { GrayButton } from "../../../components/buttons/Buttons.tsx";
import { useForm } from "react-hook-form";
import { useState,} from "react";
import ModalLinkComp from "../../../components/modals/ModalLink.tsx";
import {userService} from "../../../services/RegisterLoginService.tsx";
import {useAuth} from "../../../hooks/UseAuth.tsx";

type FormData = {
    firstName: string;
    lastNames: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const AdultSign = () => {
    // Estado para controlar la visualización del modal
    const [showModal, setShowModal] = useState(false);
    //carga
    const [isLoading, setIsLoading] = useState(false);

    const [apiError, setApiError] = useState<string | null>(null);
    const {login}=useAuth();

    // Configuración de react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormData>({
        mode: 'onTouched' // Valida al perder el foco
    });

    // La contraseña actual para compararla con la confirmación
    const password = watch('password');

    // Función para validar la contraseña y devolver el estado de cada requisito
    const getPasswordValidation = (password: string) => {
        const hasMinLength = password?.length >= 8;
        const hasNumber = /[0-9]/.test(password);

        return {
            hasMinLength,
            hasNumber,
            isValid: hasMinLength && hasNumber
        };
    };

    const passwordValidation = getPasswordValidation(password || '');

    // Función que se ejecuta cuando el formulario es válido
    const onSubmit = async  (data: FormData) => {
        try{
            setIsLoading(true);

            const response=await userService.registerParent({
                name:data.firstName,
                lastNames:data.lastNames,
                email:data.email,
                password:data.password
            });

            console.log("Datos del formulario:", response);
            // Mostrar el modal cambiando su estado
            setShowModal(true);

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
        }
        finally {
            setIsLoading(false);
        }

    };

    // Función para cerrar el modal
    const handleCloseModal  = async () => {

        try {
            // Iniciar sesión cuando se cierra el modal o cuando se va a redirigir
            await login(watch('email'),watch('password'));
            console.log("login done");
            // La redirección a /authCode ocurrirá a través del ModalLinkComp
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ marginTop: '60px' }}>
            <div className="card shadow p-4 col-md-6 col-lg-5 col-xl-4">
                <h2 className="text-center mb-4">Registro</h2>
                {/* Usamos handleSubmit de react-hook-form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3 form-floating">
                        <input
                            type="text"
                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                            id="firstName"
                            placeholder=" "
                            {...register('firstName', {
                                required: 'El nombre es obligatorio'
                            })}
                        />
                        <label htmlFor="firstName" className="form-label">Nombre</label>
                        {errors.firstName && (
                            <div className="invalid-feedback">{errors.firstName.message}</div>
                        )}
                    </div>
                    <div className="mb-3 form-floating">
                        <input
                            type="text"
                            className={`form-control ${errors.lastNames ? 'is-invalid' : ''}`}
                            id="lastNames"
                            placeholder=" "
                            {...register('lastNames', {
                                required: 'El apellido es obligatorio'
                            })}
                        />
                        <label htmlFor="lastNames" className="form-label">Apellido</label>
                        {errors.lastNames && (
                            <div className="invalid-feedback">{errors.lastNames.message}</div>
                        )}
                    </div>
                    <div className="mb-3 form-floating">
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder=" "
                            {...register('email', {
                                required: 'El email es obligatorio',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Dirección de email inválida'
                                }
                            })}
                        />
                        <label htmlFor="email" className="form-label">Email address</label>
                        <div id="emailHelp" className="form-text">No compartiremos tu email con nadie más.</div>
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email.message}</div>
                        )}
                    </div>
                    <div className="mb-3 form-floating position-relative">
                        <input
                            type="password"
                            id="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            aria-describedby="passwordHelpBlock"
                            placeholder=" "
                            {...register('password', {
                                required: 'La contraseña es obligatoria',
                                minLength: {
                                    value: 8,
                                    message: 'La contraseña debe tener al menos 8 caracteres'
                                },
                                maxLength: {
                                    value: 20,
                                    message: 'La contraseña no debe exceder los 20 caracteres'
                                },
                                pattern: {
                                    value: /^(?=.*[0-9]).{8,}$/,
                                    message: 'La contraseña debe contener al menos una letra y un número'
                                }
                            })}
                        />
                        <label htmlFor="password" className="form-label">Contraseña</label>

                        {/* Tooltip dinámico de validación */}
                        {password && (
                            <div className="password-tooltip position-absolute"
                                 style={{
                                     top: '100%',
                                     left: '0',
                                     zIndex: 1000,
                                     marginTop: '5px'
                                 }}>
                                <div className="card shadow-sm border-0" style={{ minWidth: '250px' }}>
                                    <div className="card-body p-2">
                                        <div className="small">
                                            <div className={`d-flex align-items-center mb-1 ${passwordValidation.hasMinLength ? 'text-success' : 'text-danger'}`}>
                                                <i className={`bi ${passwordValidation.hasMinLength ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2`}></i>
                                                Mínimo 8 caracteres ({password.length}/8)
                                            </div>
                                            <div className={`d-flex align-items-center ${passwordValidation.hasNumber ? 'text-success' : 'text-danger'}`}>
                                                <i className={`bi ${passwordValidation.hasNumber ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-2`}></i>
                                                Al menos un número
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div id="passwordHelpBlock" className="form-text">
                            Tu contraseña debe tener entre 8 y 20 caracteres, contener letras y números.
                        </div>
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password.message}</div>
                        )}
                    </div>
                    <div className="mb-4 form-floating">
                        <input
                            type="password"
                            id="confirmPassword"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            aria-describedby="confirmPasswordHelpBlock"
                            placeholder=" "
                            {...register('confirmPassword', {
                                required: 'Debes confirmar la contraseña',
                                validate: value =>
                                    value === password || 'Las contraseñas no coinciden'
                            })}
                        />
                        <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                        <div id="confirmPasswordHelpBlock" className="form-text">
                            Repite tu contraseña
                        </div>
                        {errors.confirmPassword && (
                            <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                        )}
                    </div>

                    {apiError && (
                        <div className="alert alert-danger" role="alert">
                            {apiError}
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Link to="/signup">
                            <GrayButton>ATRAS</GrayButton>
                        </Link>
                        <button type="submit" className="btn btn-outline-primary" disabled={isLoading}>Entrar</button>

                        {/* Modal controlado por el estado */}
                        <ModalLinkComp
                            id="submitModal"
                            title="REGISTRO EXITOSO"
                            show={showModal}
                            onClose={handleCloseModal}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdultSign;