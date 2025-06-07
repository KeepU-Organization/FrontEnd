import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { securityKeyService } from '../../services/SecurityKeyService';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import {useAuth} from "../../hooks/UseAuth.tsx";

interface BuyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<boolean>;
    productName: string;
    quantity: number;
    totalPrice: number;
}

const BuyModal: React.FC<BuyModalProps> = ({
                                               isOpen,
                                               onClose,
                                               onConfirm,
                                               productName,
                                               quantity,
                                               totalPrice
                                           }) => {
    const [securityKey, setSecurityKey] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { width, height } = useWindowSize();
    const {user}=useAuth();
    const handleVerify = async () => {
        if (!securityKey.trim()) {
            setError('Por favor ingrese su código de seguridad');
            return;
        }

        setIsVerifying(true);
        setError(null);

        try {
            let email='';
            if (user){
                email=user.email;
            }
            const isValid = await securityKeyService.checkSecurityKey(email, securityKey);

            if (isValid) {
                console.log("Codigo valido")
                const purchaseSuccess = await onConfirm();
                if (purchaseSuccess) {
                    setSuccess(true);
                } else {
                    setError('No se pudo completar la compra. Inténtelo de nuevo.');
                }
            } else {
                setError('Código de seguridad incorrecto');
            }
        } catch (err) {
            setError('Error al verificar el código de seguridad');
            console.error(err);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleClose = () => {
        setSecurityKey('');
        setError(null);
        setSuccess(false);
        onClose();
    };

    return (
        <Modal show={isOpen} onHide={handleClose} centered>
            {success && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}

            <Modal.Header closeButton>
                <Modal.Title>
                    {success ? 'Compra Exitosa' : 'Confirmar Compra'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {!success ? (
                    <>
                        <div className="mb-3">
                            <h5 className="text-center">Resumen de compra</h5>
                            <div className="d-flex justify-content-between">
                                <span>Producto:</span>
                                <span>{productName}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Cantidad:</span>
                                <span>{quantity}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                                <span>Total:</span>
                                <span className="fw-bold">S/. {totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Ingrese su código de seguridad para confirmar la compra</Form.Label>
                            <Form.Control
                                type="password"
                                value={securityKey}
                                onChange={(e) => setSecurityKey(e.target.value)}
                                placeholder="Código de seguridad"
                                disabled={isVerifying}
                            />
                        </Form.Group>

                        {error && <Alert variant="danger">{error}</Alert>}
                    </>
                ) : (
                    <div className="text-center py-4">
                        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
                        <h4 className="mt-3">¡Compra realizada con éxito!</h4>
                        <p>Su compra de {quantity} {quantity > 1 ? 'unidades' : 'unidad'} de {productName} ha sido procesada correctamente.</p>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                {!success ? (
                    <>
                        <Button variant="secondary" onClick={handleClose} disabled={isVerifying}>
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleVerify}
                            disabled={isVerifying}
                        >
                            {isVerifying ? 'Verificando...' : 'Confirmar Compra'}
                        </Button>
                    </>
                ) : (
                    <Button variant="primary" onClick={handleClose}>
                        Cerrar
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default BuyModal;