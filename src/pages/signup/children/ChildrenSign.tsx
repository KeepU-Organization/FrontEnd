import {GrayButton} from "../../../components/buttons/Buttons.tsx";
import {Link} from 'react-router'
import {useState} from "react";
import ConfirmationCodeInput from "../../../components/VerifCode.tsx";
import {Controller, useForm} from "react-hook-form";
import {useAuth} from "../../../hooks/UseAuth.tsx";
import {userService} from "../../../services/RegisterLoginService.tsx";

type formData={
    email: string,
    password: string,
    confirmPassword: string,
    invitationCode: string
}

const ChildrenSign = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const {login} =useAuth();
    const{
        register,
        handleSubmit,
        formState:{errors},
        watch,
        control
    } = useForm<formData>({
        mode: "onTouched",
    });
    const password=watch('password')

    const onSubmit = async (data:formData) => {
        setIsLoading(true);
        try{
            const response = userService.registerChild({
                email: data.email,
                password: data.password,
                invitationCode: data.invitationCode
            });
            console.log('respuesta del registro: ', response);
            await login(data.email, data.password);

        }
        catch(error: unknown) {
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
    }

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center min-vh-100 " style={{ marginTop: '60px' }}
            >
                <div className="card shadow p-4 col-md-6 col-lg-5 col-xl-4">
                    <h2 className="text-center mb-4">Registro</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="mb-3 form-floating ">
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

                        <div className="mb-3 form-floating">
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
                                        value: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                                        message: 'La contraseña debe contener al menos una letra y un número'
                                    }
                                })}
                            />
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <div id="passwordHelpBlock" className="form-text">
                                Tu contraseña debe tener entre 8 y 20 caracteres, contener letras y números, y no debe tener espacios,
                                caracteres especiales o emojis.
                            </div>
                            {errors.password && (
                                <div className="invalid-feedback">{errors.password.message}</div>
                            )}
                        </div>

                        <div className="mb-4 form-floating">
                            <input
                                type="password"
                                id="confirmPassword"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                aria-describedby="confirmPasswordHelpBlock"
                                placeholder=" "
                                {...register('confirmPassword', {
                                    required: 'La confirmación de contraseña es obligatoria',
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

                        {
                            apiError && (
                                <div className="alert alert-danger" role="alert">
                                    {apiError}
                                </div>
                            )
                        }


                        {/* Componente de código de verificación */}
                        <div className="mb-4">
                            <label className="form-label">Código de verificación</label>
                            <div className="mb-2">
                                <Controller
                                    name="invitationCode"
                                    control={control}
                                    rules={{ required: "El código de verificación es obligatorio" }}
                                    render={({ field }) => (
                                        <div>
                                            <ConfirmationCodeInput
                                                length={6}
                                                onComplete={(value) => {
                                                    field.onChange(value);
                                                }}
                                            />
                                            {errors.invitationCode && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.invitationCode.message}
                                                </div>
                                            )}
                                        </div>
                                    )}>
                                </Controller>
                            </div>
                            <div className="form-text">
                                Ingresa el código de registro que generaron tus padres.
                            </div>

                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Link to="/signup">
                                <GrayButton>ATRAS</GrayButton>
                            </Link>
                            <button type="submit" disabled={isLoading} className="btn btn-primary">Entrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default ChildrenSign;

//{verificationMessage && (
//    <div className="alert alert-info mt-2 py-2 text-center">
//        {verificationMessage}
//    </div>
//)}