import ConfirmationCodeInput from "../../components/VerifCode.tsx";

import { useState} from "react";
import {useAuth} from "../../hooks/UseAuth.tsx";

import {authCodeService} from "../../services/AuthCodeService.tsx";
import {AuthCodeRequest} from "../../types/AuthCode.tsx";
import {useEffect} from "react";
import {Controller, useForm} from "react-hook-form";

type FormData = {
    authCode: string;
}

const AuthCode = () => {

    const {user, updateCurrentUser} = useAuth();
    const [showVerificationCode, setShowVerificationCode] = useState('');
    //const [verificationMessage, setVerificationMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);

    // Configuración de react-hook-form
    const {
        handleSubmit,
        formState: { errors },
        control,

    } = useForm<FormData>({
        mode: 'onTouched',
        defaultValues: {
            authCode: ''
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
        const loadAuthCode = async () => {
            try {
                if (user?.id) {
                    const authCodeData = await authCodeService.getByUserId(user.id, 'EMAIL_VERIFICATION');
                    if (authCodeData && authCodeData.code) {
                        setShowVerificationCode(authCodeData.code);
                    }
                }
            } catch (error) {
                console.error('Error al cargar el código de autenticación:', error);
                setShowVerificationCode('No hay verification code para este usuario');
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthCode();
    }, [user?.id]);



    const handleGenerateNewCode = async (id: number | undefined, codeType: string) => {

        if (timeRemaining > 0) return;

        const authCodeRequest:AuthCodeRequest = {
            userId: id !== undefined ? id : 0, // Aseguramos que userId no sea undefined
            authCodeType: codeType
        }
        try {
            const newCode = await authCodeService.createAuthCode(authCodeRequest);
            setShowVerificationCode(`Nuevo código generado: ${newCode.code}`);
            setTimeRemaining(60);
        } catch (error) {
            console.error('Error generando nuevo código:', error);
            // Manejo de errores, como mostrar un mensaje al usuario
        }
    }


    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            setApiError(null); // Limpiar errores previos

            const authCodeData = await authCodeService.getByCode(data.authCode);

            console.log(authCodeData, user?.id);

            if (authCodeData.userAuth.user.id != user?.id ) {
                setApiError('El código de verificación no es válido para este usuario.');
                return;
            }
            if ( authCodeData.codeType !== 'EMAIL_VERIFICATION'){
                setApiError('El código de verificación no funciona para verificar el email.');
                return;
            }
            const response = await authCodeService.updateAuthCode(data.authCode);
            if (response && response.code) {
                console.log('Código de verificación actualizado:', response.code);

                await updateCurrentUser();
            }
        }  catch(error: unknown) {
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

    return(
        <div>
            <div className="d-flex justify-content-center align-items-center min-vh-100 "
            >
                <div className="card shadow p-4 col-md-6 col-lg-5 col-xl-4">
                    <h2 className="text-center mb-4"><strong>CÓDIGO DE CONFIRMACIÓN</strong></h2>
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Componente de código de verificación */}
            <div className="mb-4">
                <Controller
                    name="authCode"
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
                            {errors.authCode && (
                                <div className="invalid-feedback d-block">
                                    {errors.authCode.message}
                                </div>
                            )}
                        </div>
                    )}
                />
                <div className="form-text">
                    Para continuar usando su cuenta, ingrese el código que fue enviado a su correo.
                </div>
            </div>

            {apiError && (
                <div className="alert alert-danger" role="alert">
                    {apiError}
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4">
                <button type="submit" className="btn btn-outline-primary" disabled={isLoading}>
                    {isLoading ? 'Verificando...' : 'Entrar'}
                </button>

                <button
                    type="button"
                    onClick={() => handleGenerateNewCode(user?.id, "EMAIL_VERIFICATION")}
                    className="btn btn-outline-secondary"
                    disabled={isLoading || timeRemaining > 0}
                >
                    {timeRemaining > 0
                        ? `Espera ${timeRemaining}s`
                        : 'Generar nuevo código'}
                </button>
            </div>

        </form>
                </div>
            </div>
            <p>
                Solo por modo prueba:
                {isLoading
                    ? "Cargando código de verificación..."
                    : `codigo de verificacion es ${showVerificationCode}`
                }
            </p>
        </div>

    );
}
export default AuthCode;