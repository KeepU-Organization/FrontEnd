import { useState } from "react";
import { UserService } from "../../../services/UserService.tsx";
import { useAuth } from "../../../hooks/UseAuth.tsx";
import "./EditarPerfilPadre.scss";

export default function EditarPerfilPadre() {
    const { user, updateCurrentUser } = useAuth();
    const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
    const [mensajeFoto, setMensajeFoto] = useState("");
    const [actualPassword, setActualPassword] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [mensajePass, setMensajePass] = useState("");

    const handlePhotoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!fotoPerfil) {
            setMensajeFoto("Debe seleccionar una imagen.");
            return;
        }
        if (!user?.id) {
            setMensajeFoto("Usuario no autenticado.");
            return;
        }
        try {
            await UserService.uploadProfilePicture(user.id, fotoPerfil);
            await updateCurrentUser();
            setMensajeFoto("Foto de perfil actualizada correctamente.");
            setFotoPerfil(null);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMensajeFoto(error.message);
            } else {
                setMensajeFoto("Error al subir la foto.");
            }
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.id) {
            setMensajePass("Usuario no autenticado.");
            return;
        }
        try {
            await UserService.changePassword({
                userId: user.id,
                currentPassword: actualPassword,
                newPassword: nuevaPassword,
            });
            setMensajePass("Contraseña actualizada correctamente.");
            setActualPassword("");
            setNuevaPassword("");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMensajePass(error.message);
            } else {
                setMensajePass("Error al cambiar contraseña.");
            }
        }
    };

    return (
        <div className="editar-perfil-grid">
            <div className="editar-perfil-card">
                <h2 className="editar-perfil-title">Cambiar foto de perfil</h2>
                <form onSubmit={handlePhotoSubmit} className="editar-perfil-form">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFotoPerfil(e.target.files?.[0] || null)}
                        className="editar-perfil-input"
                    />
                    <button className="editar-perfil-btn editar-perfil-btn-green">Subir foto</button>
                </form>
                {mensajeFoto && <p className="editar-perfil-msg">{mensajeFoto}</p>}
            </div>
            <div className="editar-perfil-card">
                <h2 className="editar-perfil-title">Cambiar contraseña</h2>
                <form onSubmit={handlePasswordSubmit} className="editar-perfil-form">
                    <input
                        type="password"
                        placeholder="Contraseña actual"
                        value={actualPassword}
                        onChange={(e) => setActualPassword(e.target.value)}
                        className="editar-perfil-input"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={nuevaPassword}
                        onChange={(e) => setNuevaPassword(e.target.value)}
                        className="editar-perfil-input"
                        required
                    />
                    <button className="editar-perfil-btn editar-perfil-btn-blue">Guardar contraseña</button>
                </form>
                {mensajePass && <p className="editar-perfil-msg">{mensajePass}</p>}
            </div>
        </div>
    );
}