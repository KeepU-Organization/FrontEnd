import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface PerfilHijo {
    nombre: string;
    email: string;
    telefono: string;
    actualPassword: string;
    nuevaPassword: string;
    codigoVerificacion: string;
    fotoPerfil: File | null;
}

export default function EditarPerfilHijo() {
    const [form, setForm] = useState<PerfilHijo>({
        nombre: "",
        email: "",
        telefono: "",
        actualPassword: "",
        nuevaPassword: "",
        codigoVerificacion: "",
        fotoPerfil: null,
    });

    const [mensaje, setMensaje] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/hijos/perfil`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setForm((prev) => ({
                    ...prev,
                    nombre: data.nombre,
                    email: data.email,
                    telefono: data.telefono,
                }));
            });
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (name === "fotoPerfil" && files) {
            setForm({ ...form, fotoPerfil: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nombre", form.nombre);
        formData.append("email", form.email);
        formData.append("telefono", form.telefono);
        formData.append("actualPassword", form.actualPassword);
        formData.append("nuevaPassword", form.nuevaPassword);
        formData.append("codigoVerificacion", form.codigoVerificacion);
        if (form.fotoPerfil) {
            formData.append("fotoPerfil", form.fotoPerfil);
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/hijos/perfil`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMensaje("Perfil actualizado correctamente.");
                setTimeout(() => navigate("/dashboard-hijo"), 1500);
            } else {
                setMensaje(data.message || "Error al actualizar el perfil.");
            }
        } catch (error) {
            console.error("Ocurrió un error:", error);
        }

    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Editar Perfil - Hijo</h1>

            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="w-full p-2 border"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Correo"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-2 border"
                    required
                />

                <input
                    type="tel"
                    name="telefono"
                    placeholder="Número de celular"
                    value={form.telefono}
                    onChange={handleChange}
                    className="w-full p-2 border"
                    required
                />

                <input
                    type="password"
                    name="actualPassword"
                    placeholder="Contraseña actual"
                    value={form.actualPassword}
                    onChange={handleChange}
                    className="w-full p-2 border"
                    required
                />

                <input
                    type="password"
                    name="nuevaPassword"
                    placeholder="Nueva contraseña"
                    value={form.nuevaPassword}
                    onChange={handleChange}
                    className="w-full p-2 border"
                />

                <input
                    type="text"
                    name="codigoVerificacion"
                    placeholder="Código de verificación (2 pasos)"
                    value={form.codigoVerificacion}
                    onChange={handleChange}
                    className="w-full p-2 border"
                    required
                />

                <input
                    type="file"
                    name="fotoPerfil"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full p-2 border"
                />

                <button type="submit" className="bg-green-600 text-white px-4 py-2">
                    Guardar cambios
                </button>

                {mensaje && <p className="text-center mt-4 text-red-600">{mensaje}</p>}
            </form>
        </div>
    );
}
