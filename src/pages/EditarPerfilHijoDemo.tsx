import { useState } from "react";

export default function EditarPerfilHijoDemo() {
    const [formData, setFormData] = useState({
        nombre: "Lucas Gómez",
        correo: "lucas@keepu.com",
        celular: "999999999",
        nuevaContrasena: "",
        confirmarContrasena: "",
        codigo2fa: "",
        fotoPerfil: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "fotoPerfil" && files) {
            setFormData({ ...formData, fotoPerfil: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Cambios simulados enviados (sin backend)");
    };

    return (
        <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
            <h2>Editar Perfil del Hijo (Demo)</h2>
            <form onSubmit={handleSubmit}>
                <label>Nombre</label>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                />

                <label>Correo electrónico</label>
                <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                />

                <label>Celular</label>
                <input
                    type="tel"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                />

                <label>Nueva contraseña</label>
                <input
                    type="password"
                    name="nuevaContrasena"
                    value={formData.nuevaContrasena}
                    onChange={handleChange}
                />

                <label>Confirmar nueva contraseña</label>
                <input
                    type="password"
                    name="confirmarContrasena"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                />

                <label>Código de verificación (2FA)</label>
                <input
                    type="text"
                    name="codigo2fa"
                    value={formData.codigo2fa}
                    onChange={handleChange}
                />

                <label>Foto de perfil</label>
                <input type="file" name="fotoPerfil" onChange={handleChange} />

                <button type="submit" style={{ marginTop: 10 }}>
                    Guardar cambios
                </button>
            </form>
        </div>
    );
}
