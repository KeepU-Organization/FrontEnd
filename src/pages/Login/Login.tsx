import {Link} from "react-router-dom";
import {GrayButton} from "../../components/buttons/Buttons.tsx";
import { useState } from "react";
import {useForm} from "react-hook-form";

import {useNavigate} from "react-router-dom";
import {useAuth} from "../../hooks/UseAuth.tsx";

type FormData = {
    email: string;
    password: string;
}
const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const navigate = useNavigate(); // Añadir hook de navegación
    const {user,login}=useAuth();

    // Configuración de react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        mode: 'onTouched' // Valida al perder el foco
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setApiError(null); // Limpiar errores previos

        try {
            // Iniciar sesión
            const response = await login(data.email, data.password);
            console.log("Respuesta del login: ", response);

            // Actualizar datos del usuario actual (importante para tener los datos más recientes)


            // Redirigir según el tipo de usuario
            if (user?.userType === 'PARENT') {
                navigate('/homeParent');
            } else if (user?.userType === 'CHILD') {
                navigate('/homeChildren');
            }
        }  catch(error: unknown) {
            console.log('error en el inicio de sesión: ', error);

            if (error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' && 'data' in error.response) {

                const data = error.response.data;
                setApiError(typeof data === 'object' && data && 'message' in data ?
                    data.message as string : 'Error en el inicio de sesión');
            } else if (error instanceof Error) {

                setApiError(error.message);
            } else {
                setApiError('Ha ocurrido un error durante el inicio de sesión');
            }
        }
        finally {
            setIsLoading(false);
        }

    };

    return ( <div className="d-flex justify-content-center align-items-center min-vh-100" >
            <div className="card shadow p-4 col-md-6 col-lg-5 col-xl-4">
                <h2 className="text-center mb-4">Hola, <br/>  Bienvenido de vuelta</h2>
                
                <form onSubmit={handleSubmit(onSubmit)}>

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
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <div id="emailHelp" className="form-text"></div>
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
                            })}
                        />
                        <label htmlFor="password" className="form-label">Contraseña</label>
                    </div>

                    {apiError && (
                        <div className="alert alert-danger" role="alert">
                            {apiError}
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Link to="/">
                            <GrayButton>ATRAS</GrayButton>
                        </Link>
                        <button type="submit" className="btn btn-outline-primary" disabled={isLoading}>ENTRAR</button>




                    </div>
                </form>
            </div>
        </div>
    )
}
export default Login;