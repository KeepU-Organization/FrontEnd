import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { SpendingLimitService } from '../../services/SpendingLimitService.tsx';
import { CreateSpendingLimitRequest } from '../../types/CreateSpendingLimitRequest.tsx';
import { SpendingLimitResponse } from '../../types/SpendingLimitResponse.tsx';
import toast from 'react-hot-toast';
import { useWallets } from '../../hooks/UseWallets.tsx';

interface Props {
    show: boolean;
    onClose: () => void;
}

const EditSpendingLimitModal: React.FC<Props> = ({ show, onClose }) => {
    const [amount, setAmount] = useState('');
    const [existingLimit, setExistingLimit] = useState<SpendingLimitResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [confirmUpdate, setConfirmUpdate] = useState(false);

    const { wallets } = useWallets();
    const childWallets = wallets.filter(wallet => wallet.walletType === 'STANDARD');

    useEffect(() => {
        const fetchLimit = async () => {
            try {
                setLoading(true);
                if (childWallets.length > 0) {
                    const limit = await SpendingLimitService.getLimitByWalletId(childWallets[0].walletId);
                    setExistingLimit(limit);
                    setAmount(limit.maxAmount.toString());
                }
            } catch (_) {
                setExistingLimit(null); // No hay límite actual
            } finally {
                setLoading(false);
            }
        };

        if (show) fetchLimit();
    }, [show, childWallets]);

    const handleSubmit = async () => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast.error('Ingresa un monto válido');
            return;
        }

        try {
            setLoading(true);
            await Promise.all(
                childWallets.map(wallet => {
                    const payload: CreateSpendingLimitRequest = {
                        maxAmount: numericAmount,
                        walletId: wallet.walletId
                    };
                    return SpendingLimitService.createOrUpdateLimit(payload);
                })
            );
            toast.success(existingLimit ? 'Límites actualizados con éxito' : 'Límites creados con éxito');
            setConfirmUpdate(false);
            onClose();
        } catch (e: any) {
            toast.error('Error al guardar los límites');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{existingLimit ? 'Actualizar Límite de Gasto' : 'Establecer Límite de Gasto'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <>
                        {existingLimit && !confirmUpdate ? (
                            <div className="text-center">
                                <p>Ya existe un límite actual de <strong>S/. {existingLimit.maxAmount}</strong>.</p>
                                <p>¿Deseas reemplazarlo para todos los hijos?</p>
                                <div className="d-flex justify-content-center gap-2 mt-3">
                                    <Button variant="secondary" onClick={onClose}>No</Button>
                                    <Button variant="primary" onClick={() => setConfirmUpdate(true)}>Sí, editar</Button>
                                </div>
                            </div>
                        ) : (
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Monto máximo (S/.)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        placeholder="Ingrese el nuevo límite"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </Form.Group>
                            </Form>
                        )}
                    </>
                )}
            </Modal.Body>
            {(!existingLimit || confirmUpdate) && (
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default EditSpendingLimitModal;