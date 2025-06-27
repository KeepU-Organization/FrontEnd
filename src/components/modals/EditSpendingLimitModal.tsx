import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { SpendingLimitService } from '../../services/SpendingLimitService.tsx';
import toast from 'react-hot-toast';
import { CreateSpendingLimitRequest } from '../../types/CreateSpendingLimitRequest.tsx';
import { SpendingLimitResponse } from '../../types/SpendingLimitResponse.tsx';
import { MonitorChildrenService } from '../../services/MonitorChildrenService.tsx';
import { WalletResponse } from '../../types/Wallets.tsx';
import { walletService } from '../../services/WalletService.tsx';
import { useAuth } from '../../hooks/UseAuth.tsx'; // <--- Importa el hook

interface Props {
    show: boolean;
    onClose: () => void;
}

const EditSpendingLimitModal: React.FC<Props> = ({ show, onClose }) => {
    const { user } = useAuth(); // <--- Obtenemos el usuario padre


    type ExtendedWallet = WalletResponse & { childName: string };

    const [childrenWallets, setChildrenWallets] = useState<ExtendedWallet[]>([]);


    const [selectedWalletId, setSelectedWalletId] = useState('');
    const [amount, setAmount] = useState('');
    const [existingLimit, setExistingLimit] = useState<SpendingLimitResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [confirmUpdate, setConfirmUpdate] = useState(false);

    console.log("Modal montado - show:", show, "parentId:", user?.id);


    useEffect(() => {
        const loadLimit = async () => {
            if (!selectedWalletId) return;
            setLoading(true);
            try {
                const limit = await SpendingLimitService.getLimitByWalletId(selectedWalletId);
                setExistingLimit(limit);
                setAmount(limit.maxAmount.toString());
            } catch {
                setExistingLimit(null);
            } finally {
                setLoading(false);
            }
        };

        if (show && selectedWalletId) {
            loadLimit();
        }
    }, [show, selectedWalletId]);




    useEffect(() => {
        const loadWallets = async () => {
            if (!user?.id) return;
            try {
                const children = await MonitorChildrenService.getChildrenList(user.id);
                console.log("Children list:", children);

                const walletList: ExtendedWallet[] = [];

                for (const child of children) {
                    const wallet = await walletService.getWalletByUserId(child.id);
                    console.log(`Wallet for child ${child.id}:`, wallet);
                    if (wallet) {
                        // Añadir el nombre del hijo a la billetera
                        walletList.push({
                            ...wallet,
                            childName: child.name // Añadir el nombre del hijo desde el objeto child
                        });
                    }
                }

                console.log("Wallets cargadas:", walletList);
                setChildrenWallets(walletList);
            } catch (err) {
                console.error('Error cargando wallets de hijos:', err);
                toast.error('No se pudo cargar las billeteras de los hijos');
            } finally {
                setSelectedWalletId('');
                setAmount('');
                setExistingLimit(null);
                setConfirmUpdate(false);
            }
        };

        if (show) {
            loadWallets();
        }
    }, [show, user?.id]);


    const handleSubmit = async () => {
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            toast.error('Ingresa un monto válido mayor a 0');
            return;
        }

        if (!selectedWalletId) {
            toast.error('Selecciona una billetera');
            return;
        }

        const request: CreateSpendingLimitRequest = {
            walletId: selectedWalletId,
            maxAmount: parsedAmount
        };

        try {
            setLoading(true);
            await SpendingLimitService.createOrUpdateLimit(request);
            toast.success(existingLimit ? 'Límite actualizado' : 'Límite creado');
            onClose();
        } catch {
            toast.error('Error al guardar el límite');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {existingLimit ? 'Actualizar Límite' : 'Establecer Límite'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label>Seleccionar Hijo</Form.Label>
                            <Form.Select
                                value={selectedWalletId}
                                onChange={(e) => setSelectedWalletId(e.target.value)}
                            >
                                <option value="">-- Selecciona una billetera --</option>
                                {childrenWallets.map((wallet) => (
                                    <option key={wallet.walletId} value={wallet.walletId}>
                                        {wallet.childName || `Hijo #${wallet.userId}`}: Wallet {wallet.walletId}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {existingLimit && !confirmUpdate ? (
                            <div className="text-center">
                                <p>Límite actual: <strong>S/. {existingLimit.maxAmount}</strong></p>
                                <p>¿Deseas actualizarlo?</p>
                                <div className="d-flex justify-content-center gap-2">
                                    <Button variant="secondary" onClick={onClose}>No</Button>
                                    <Button variant="primary" onClick={() => setConfirmUpdate(true)}>Sí</Button>
                                </div>
                            </div>
                        ) : (
                            <Form.Group>
                                <Form.Label>Monto Máximo (S/.)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Ingresa el monto"
                                />
                            </Form.Group>
                        )}
                    </>
                )}
            </Modal.Body>
            {(!existingLimit || confirmUpdate) && selectedWalletId && (
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default EditSpendingLimitModal;