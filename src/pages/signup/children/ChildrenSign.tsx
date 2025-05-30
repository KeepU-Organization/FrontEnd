import {GrayButton} from "../../../components/buttons/Buttons.tsx";
import {Link} from 'react-router'
import {SetStateAction, useState} from "react";
import ConfirmationCodeInput from "../../../components/VerifCode.tsx";
//import {useForm} from "react-hook-form";
//
//
//type formData={
//    email: string,
//    password: string,
//    confirmPassword: string
//}

const ChildrenSign = () => {

    //const[showModal, setShowModal] = useState<boolean>(false);
    //const [isLoading, setIsLoading] = useState<boolean>(false);
//
    //const{
    //    register,
    //    handleSubmit,
    //    formState:{errors},
    //    watch
    //} = useForm<formData>({
    //    mode: "onTouched",
    //});
    //const password=watch('password')
//
    //const onSubmit = (e:FormEvent<formData>) => {}


    const [verificationCode, setVerificationCode] = useState('');
    //const [verificationMessage, setVerificationMessage] = useState('');
    const handleCodeComplete = (code: SetStateAction<string>) => {
        setVerificationCode(code);
        // setVerificationMessage(`Código ${code} recibido`);
        // Aquí podrías hacer una verificación en tiempo real si lo necesitas
    };
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center min-vh-100 " style={{ marginTop: '60px' }}
            >
                <div className="card shadow p-4 col-md-6 col-lg-5 col-xl-4">
                    <h2 className="text-center mb-4">Registro</h2>
                    <form>

                        <div className="mb-3 form-floating ">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                aria-describedby="email"
                                placeholder=" "/>
                            <label htmlFor="email" className="form-label">Email address</label>
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>

                        <div className="mb-3 form-floating">
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                aria-describedby="passwordHelpBlock"
                                placeholder=" "
                            />
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <div id="passwordHelpBlock" className="form-text">
                                Tu contraseña debe tener entre 8 y 20 caracteres, contener letras y números, y no debe tener espacios,
                                caracteres especiales o emojis.
                            </div>
                        </div>

                        <div className="mb-4 form-floating">
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                aria-describedby="confirmPasswordHelpBlock"
                                placeholder=" "
                            />
                            <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                            <div id="confirmPasswordHelpBlock" className="form-text">
                                Repite tu contraseña
                            </div>
                        </div>
                        {/* Componente de código de verificación */}
                        <div className="mb-4">
                            <label className="form-label">Código de verificación</label>
                            <div className="mb-2">
                                <ConfirmationCodeInput
                                    length={6}
                                    onComplete={handleCodeComplete}
                                />
                            </div>
                            <div className="form-text">
                                Ingresa el código de registro que generaron tus padres.
                            </div>

                        </div>
                        {verificationCode}
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Link to="/signup">
                                <GrayButton>ATRAS</GrayButton>
                            </Link>
                            <button type="submit" className="btn btn-primary">Entrar</button>
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