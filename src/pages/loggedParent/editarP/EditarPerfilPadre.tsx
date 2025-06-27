import { useState } from "react";
import { UserService } from "../../../services/UserService.tsx";
import { useAuth } from "../../../hooks/UseAuth.tsx";

export default function EditarPerfilPadre() {
    const { user } = useAuth(); // ✅ obtiene el user directamente
    const [actualPassword, setActualPassword] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
    const [mensaje, setMensaje] = useState("");
    const { updateCurrentUser } = useAuth();

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id) {
            setMensaje("Usuario no autenticado.");
            return;
        }

        try {
            await UserService.changePassword({
                userId: user.id, // el de la entidad UserAuth
                currentPassword: actualPassword,
                newPassword: nuevaPassword,
            });
            setMensaje("Contraseña actualizada correctamente.");
            setActualPassword("");
            setNuevaPassword("");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMensaje(error.message);
            } else {
                setMensaje("Error al cambiar contraseña.");
            }
        }
    };

    const handlePhotoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!fotoPerfil) {
            setMensaje("Debe seleccionar una imagen.");
            return;
        }

        if (!user?.id) {
            setMensaje("Usuario no autenticado.");
            return;
        }

        try {
            await UserService.uploadProfilePicture(user.id, fotoPerfil);
            await updateCurrentUser(); // ✅ Esto actualizará la imagen en el context y por tanto en la nav
            setMensaje("Foto de perfil actualizada correctamente.");
            setFotoPerfil(null);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setMensaje(error.message);
            } else {
                setMensaje("Error al subir la foto.");
            }
        }
    };



    return (
        <div className="p-6 max-w-xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold mb-6">Editar Perfil - Padre</h1>

            {/* Cambiar contraseña */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <h2 className="font-semibold">Cambiar contraseña</h2>
                <input
                    type="password"
                    placeholder="Contraseña actual"
                    value={actualPassword}
                    onChange={(e) => setActualPassword(e.target.value)}
                    className="w-full p-2 border"
                    required
                />
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    className="w-full p-2 border"
                    required
                />
                <button className="bg-blue-600 text-white px-4 py-2">Guardar contraseña</button>
            </form>

            {/* Cambiar foto */}
            <form onSubmit={handlePhotoSubmit} className="space-y-4">
                <h2 className="font-semibold">Cambiar foto de perfil</h2>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFotoPerfil(e.target.files?.[0] || null)}
                    className="w-full p-2 border"
                />
                <button className="bg-green-600 text-white px-4 py-2">Subir foto</button>
            </form>

            {mensaje && <p className="text-center mt-4 text-red-600">{mensaje}</p>}
        </div>
    );
}