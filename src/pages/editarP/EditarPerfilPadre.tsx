import React, { useState, useEffect } from "react";
import "./EditProfile.css";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../../hooks/UseAuth";

const EditProfilePadre: React.FC = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    enable2FA: false,
  });

  const [showPassword, setShowPassword] = useState(false); // Para mostrar contraseña
  const [errors, setErrors] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null); // Para enviar al backend
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Para mostrar en el frontend

  const [fieldErrors, setFieldErrors] = useState({
  name: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: ""
  });


  useEffect(() => {
  if (user) {
    setFormData({
      name: user.name || "",
      lastName: user.lastname || "",
      email: user.email || "",
      password: "",
      confirmPassword: "",
      enable2FA: false,
    });

    if (user.profilePicture) {
      const fullUrl = import.meta.env.VITE_API_URL + user.profilePicture;
      setPreviewImage(fullUrl); // para mostrar
    }
  }
}, [user]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target;
  const newValue = type === "checkbox" ? checked : value;

  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  // Solo valida campos de texto, no checkboxes
  if (type !== "checkbox") {
    validateField(name, value); // value siempre es string
  }
  };


  const isValidPassword = (password: string) => {
    const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,20}$/;
    return passwordRegex.test(password);
  };


  const validateField = (name: string, value: string) => {
  let error = "";

  if (name === "confirmPassword" && value !== formData.password) {
    error = "Las contraseñas no coinciden";
  }

  setFieldErrors((prev) => ({
    ...prev,
    [name]: error
  }));
  };

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setProfileImage(file); // para enviar
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string); // para mostrar
    };
    reader.readAsDataURL(file);
  }
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors("");

  const { name, lastName, email, password, confirmPassword, enable2FA } = formData;

  // Validaciones básicas
  if (!name || !lastName || !email) {
    setErrors("Todos los campos obligatorios deben estar llenos.");
    return;
  }

  if (password || confirmPassword) {
    if (!isValidPassword(password)) {
      setErrors("La contraseña no cumple con los requisitos.");
      return;
    }
    if (password !== confirmPassword) {
      setErrors("Las contraseñas no coinciden.");
      return;
    }
  }

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("lastName", lastName);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    formDataToSend.append("enable2FA", String(enable2FA));
    if (profileImage) {
      formDataToSend.append("profilePicture", profileImage); // imagen
    }

    const userId = user?.id;

    const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
      method: "PUT",
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el perfil.");
    }

    const data = await response.json();
    console.log("Perfil actualizado correctamente:", data);
     // Mostrar mensaje
    String("Perfil actualizado correctamente.");
  } catch (error) {
    console.error("Error al enviar los datos:", error);
    setErrors("Hubo un problema al actualizar el perfil.");
     String("");
  }
};



  return (
    <div className="edit-profile-container">
      <h2 className="edit-profile-title">EDITAR PERFIL</h2>
      <Row>
        {/* Lado izquierdo */}
        <Col md={5} className="border-end pe-4 text-center">
          <img
            src={
              user?.profilePicture
                ? import.meta.env.VITE_API_URL + user.profilePicture
                : "https://via.placeholder.com/100"
            }
            alt="Avatar"
            className="edit-profile-avatar rounded-circle"
          />
          <h5 className="mt-3">{user?.name} {user?.lastname}</h5>
          <p>{user?.email}</p>
        </Col>

        {/* Lado derecho */}
        <Col md={7}>
        <Form onSubmit={handleSubmit} className="edit-profile-form">
          {errors && <p style={{ color: "red" }}>{errors}</p>}

          {/* NOMBRE */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Ingresa tu nombre"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!fieldErrors.name}
              isValid={formData.name.trim() !== "" && !fieldErrors.name}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* APELLIDOS */}
          <Form.Group className="mb-3">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Ingresa tus apellidos"
              value={formData.lastName}
              onChange={handleChange}
              isInvalid={!!fieldErrors.lastName}
              isValid={formData.lastName.trim() !== "" && !fieldErrors.lastName}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.lastName}
            </Form.Control.Feedback>
          </Form.Group>

          {/* EMAIL */}
          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Ingresa tu correo electrónico"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!fieldErrors.email}
              isValid={formData.email.trim() !== "" && !fieldErrors.email}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.email}
            </Form.Control.Feedback>
          </Form.Group>

          {/* IMAGEN */}
          <Form.Group className="mb-3">
            <Form.Label>Subir nueva imagen de perfil</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          {previewImage && (
          <img src={previewImage} alt="Vista previa" style={{ maxWidth: "150px", borderRadius: "8px" }} />
                    )}


          {/* CONTRASEÑA */}
          <Form.Group className="mb-1">
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingresa una nueva contraseña"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!fieldErrors.password}
              isValid={formData.password !== "" && !fieldErrors.password}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.password}
            </Form.Control.Feedback>
            <Form.Text muted>
              Tu contraseña debe tener entre 8 y 20 caracteres, contener letras y números, y no debe tener espacios, caracteres especiales o emojis.
            </Form.Text>
          </Form.Group>

          {/* CONFIRMAR CONTRASEÑA */}
          <Form.Group className="mb-3">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Vuelve a ingresar la contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              isInvalid={!!fieldErrors.confirmPassword}
              isValid={formData.confirmPassword !== "" && !fieldErrors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {fieldErrors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {/* MOSTRAR CONTRASEÑA */}
          <Form.Check
            type="checkbox"
            label="Mostrar contraseña"
            className="mb-3"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />

          {/* 2FA */}
          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              name="enable2FA"
              checked={formData.enable2FA}
              onChange={handleChange}
              label="Habilitar doble autenticación"
            />
          </Form.Group>

          {/* BOTÓN */}
          <Button variant="primary" type="submit" className="w-100">
            Guardar Cambios
          </Button>
        </Form>
      </Col>

      </Row>
    </div>
  );
};

export default EditProfilePadre;
