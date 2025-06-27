import React, { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, DollarSign} from 'lucide-react';
import { ParentHistoryService } from "../../../services/ParentHistoryService.tsx";
import { useWallets } from "../../../hooks/UseWallets.tsx";
import { TransactionResponse } from '../../../types/Transactions';


import {
    Gamepad,
    Shirt,
    Smartphone,
    Coffee,
    Sofa,
    BookOpen,
    Gift,
    ShoppingBag
} from 'lucide-react';
import {Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './ChildHistory.css'


interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  walletId?: string;
  walletName?: string;
  giftCardCode?: string;  // opcional
  storeType?: string;     // opcional
  storeName?: string;     //opcional
}



const ChildHistory: React.FC = () => {
    const [typeFilter, setTypeFilter] = useState<string>('');
    const [dateFilter, setDateFilter] = useState<string>('');
    const [amountFilter, setAmountFilter] = useState<string>('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { wallets } = useWallets();

    const [showCodeModal, setShowCodeModal] = useState(false);
    const [selectedCode, setSelectedCode] = useState("");

// Función para mostrar el código
    const handleShowCode = (code: string) => {
        setSelectedCode(code);
        setShowCodeModal(true);
    };


    // Cargar transacciones de forma asíncrona
    useEffect(() => {
    const fetchTransactions = async () => {
        if (wallets.length > 0) {
            try {
                setLoading(true);

                const data: TransactionResponse[] = await ParentHistoryService.getParentHistory(wallets[0].walletId);

               const transformedData: Transaction[] = data.map((item, index) => ({
                id: (index + 1).toString(),
                amount: item.amount,
                description: item.description,
                date: item.transactionDate,
                walletId: item.walletId,
                walletName: item.walletName || 'Billetera principal',
                storeType: item.storeType ?? '',
                storeName: item.storeName ?? '',
                giftCardCode: item.giftCardCode ?? '',
                type: item.transactionType
                }));





                setTransactions(transformedData);
            } catch (error) {
                console.error("Error al cargar transacciones:", error);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        }
    };

    fetchTransactions();
}, [wallets]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction: Transaction) => {
            const matchesType = !typeFilter || transaction.storeType === typeFilter;
            const matchesDate = !dateFilter || transaction.date.includes(dateFilter);
            const matchesAmount = !amountFilter || transaction.amount.toString().includes(amountFilter);

            return matchesType && matchesDate && matchesAmount;
        });
    }, [typeFilter, dateFilter, amountFilter, transactions]);



    const getTransactionIcon = (storeType: string) => {
        switch (storeType) {
            case 'GAMING':
                return <Gamepad className="w-5 h-5 text-purple-600" />;
            case 'CLOTHING':
                return <Shirt className="w-5 h-5 text-blue-500" />;
            case 'ELECTRONICS':
                return <Smartphone className="w-5 h-5 text-cyan-500" />;
            case 'FOOD':
                return <Coffee className="w-5 h-5 text-orange-500" />;
            case 'FURNITURE':
                return <Sofa className="w-5 h-5 text-amber-700" />;
            case 'BOOKS':
                return <BookOpen className="w-5 h-5 text-teal-700" />;
            case 'TOYS':
                return <Gift className="w-5 h-5 text-pink-500" />;
            case 'DEPARTMENT_STORE':
                return <ShoppingBag className="w-5 h-5 text-gray-700" />;
            default:
                return <ShoppingBag className="w-5 h-5 text-secondary" />;
        }
    };

    const getTransactionBadgeClass = (type: string) => {
        // Convertir a mayúsculas para asegurar la comparación
        if (!type) {
            return 'bg-secondary text-white';
        }

        switch (type) {
            case 'GAMING':
                return 'bg-purple';
            case 'CLOTHING':
                return 'bg-primary';
            case 'ELECTRONICS':
                return 'bg-info';
            case 'FOOD':
                return 'bg-warning';
            case 'FURNITURE':
                return 'bg-dark';
            case 'BOOKS':
                return 'bg-success';
            case 'TOYS':
                return 'bg-danger';
            case 'DEPARTMENT_STORE':
                return 'bg-secondary';
            default:
                return 'bg-secondary';
        }
    };

    const getCardBorderClass = (type: string) => {

        if (!type) {
            return 'border-secondary';
        }
        switch (type) {
            case 'GAMING':
                return 'border-purple';
            case 'CLOTHING':
                return 'border-primary';
            case 'ELECTRONICS':
                return 'border-info';
            case 'FOOD':
                return 'border-warning';
            case 'FURNITURE':
                return 'border-dark';
            case 'BOOKS':
                return 'border-success';
            case 'TOYS':
                return 'border-danger';
            case 'DEPARTMENT_STORE':
                return 'border-secondary';
            default:
                return 'border-secondary';
        }
    };



    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', marginTop:'30px'}}>
            <div className="container-fluid px-4 py-5">
                <div className="row justify-content-center">
                    <div className="col-12 col-xl-10">
                        {/* Título */}
                        <div className="mb-5">
                            <h1 className="display-4 fw-bold text-dark mb-2">Movimientos</h1>
                            <p className="lead text-muted">Gestiona y filtra tu historial de transacciones</p>
                        </div>

                        {/* Filtros */}
                        <div className="card shadow-sm mb-5" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-4">
                                <div className="row g-4">

                                    {/* Filtro por tipo */}
                                    <div className="col-12 col-md-4">
                                        <label className="form-label fw-semibold text-dark">
                                            <Search size={16} className="me-2" />
                                            Tipo de Transacción
                                        </label>
                                        <select
                                            className="form-select form-select-lg"
                                            value={typeFilter}
                                            onChange={(e) => setTypeFilter(e.target.value)}
                                            style={{ borderRadius: '0.75rem' }}
                                        >
                                            <option value="">Todas las categorías</option>
                                            <option value="GAMING">Videojuegos</option>
                                            <option value="CLOTHING">Ropa</option>
                                            <option value="ELECTRONICS">Electrónica</option>
                                            <option value="FOOD">Comida</option>
                                            <option value="FURNITURE">Muebles</option>
                                            <option value="BOOKS">Libros</option>
                                            <option value="TOYS">Juguetes</option>
                                            <option value="DEPARTMENT_STORE">Tienda departamental</option>
                                        </select>
                                    </div>

                                    {/* Filtro por fecha */}
                                    <div className="col-12 col-md-4">
                                        <label className="form-label fw-semibold text-dark">
                                            <Calendar size={16} className="me-2" />
                                            Filtrar por Fecha
                                        </label>
                                        <input
                                            type="date"
                                            className="form-control form-control-lg"
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            style={{ borderRadius: '0.75rem' }}
                                        />
                                    </div>

                                    {/* Filtro por monto */}
                                    <div className="col-12 col-md-4">
                                        <label className="form-label fw-semibold text-dark">
                                            <DollarSign size={16} className="me-2" />
                                            Filtrar por Monto
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control form-control-lg"
                                            placeholder="Ingresa monto"
                                            value={amountFilter}
                                            onChange={(e) => setAmountFilter(e.target.value)}
                                            style={{ borderRadius: '0.75rem' }}
                                        />
                                    </div>
                                </div>

                                {/* Botón limpiar filtros */}
                                {(typeFilter || dateFilter || amountFilter) && (
                                    <div className="mt-4 pt-3 border-top">
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => {
                                                setTypeFilter('');
                                                setDateFilter('');
                                                setAmountFilter('');
                                            }}
                                        >
                                            Limpiar filtros
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lista de transacciones */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="h3 fw-semibold text-dark mb-0">
                                Transacciones ({filteredTransactions.length})
                            </h2>
                        </div>

                        {loading ? (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                                <p className="text-gray-500">Cargando transacciones...</p>
                            </div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="card shadow-sm text-center py-5" style={{ borderRadius: '1rem' }}>
                                <div className="card-body">
                                    <div className="text-muted mb-4">
                                        <Search size={64} className="mx-auto d-block" />
                                    </div>
                                    <h3 className="h4 fw-semibold text-muted mb-2">
                                        No se encontraron transacciones
                                    </h3>
                                    <p className="text-muted">
                                        Intenta ajustar los filtros para ver más resultados
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="row g-4">
                                {filteredTransactions.map((transaction: Transaction) => (
                                    <div key={transaction.id} className="col-12 col-md-6 col-lg-4">
                                        <div
                                            className={`card h-100 shadow-sm border-2 ${getCardBorderClass(transaction.storeType?? '')} position-relative`}
                                            style={{
                                                borderRadius: '1rem',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                e.currentTarget.classList.add('shadow');
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.classList.remove('shadow');
                                            }}
                                        >
                                            <div className="card-body p-4">

                                                {/* Header de la transacción */}
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div className="d-flex align-items-center">
                                                        {getTransactionIcon(transaction.storeType ?? '')}
                                                        <span className="fw-semibold text-dark ms-2 text-capitalize">
                                {transaction.storeType}
                              </span>
                                                    </div>
                                                    <small className="text-muted">
                                                        {formatDate(transaction.date)}
                                                    </small>
                                                </div>

                                                {/* Información de la wallet */}
                                                <div className="mb-3">
                                                    <small className="text-muted d-block">Wallet</small>
                                                    <h6 className="fw-semibold text-dark mb-0">
                                                        {transaction.walletName}
                                                    </h6>
                                                </div>

                                                {/* Monto */}
                                                <div className="mb-3">
                                                    <small className="text-muted d-block">Monto</small>
                                                    <h4 className="fw-bold text-dark mb-0">
                                                        ${transaction.amount.toLocaleString('es-ES', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                    </h4>
                                                </div>

                                                {/* Footer de la tarjeta */}
                                                <div className="border-top pt-3 mt-3">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <small className="text-muted">ID: {transaction.id}</small>
                                                        <span className={`badge ${getTransactionBadgeClass(transaction.storeType ?? '')} px-2 py-1`}>
                                {transaction.storeType}
                              </span>
                                                    </div>

                                                    {transaction.giftCardCode && (
                                                        <button
                                                            className="btn btn-sm btn-outline-primary w-100 mt-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleShowCode(transaction.giftCardCode?? '');
                                                            }}
                                                        >
                                                            <i className="bi bi-credit-card me-1"></i>
                                                            Ver código de tarjeta
                                                        </button>
                                                    )}
                                                </div>


                                                <Modal show={showCodeModal} onHide={() => setShowCodeModal(false)} centered>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>Código de Tarjeta de Regalo</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body className="text-center py-4">
                                                        <div className="border rounded p-3 mb-3 bg-light">
                                                            <h3 className="mb-0">{selectedCode}</h3>
                                                        </div>
                                                        <p className="text-muted small mb-0">
                                                            Este código es único y te permite canjear tu regalo.
                                                        </p>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={() => setShowCodeModal(false)}>
                                                            Cerrar
                                                        </Button>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(selectedCode);
                                                                toast.success("Código copiado al portapapeles");
                                                            }}
                                                        >
                                                            Copiar código
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildHistory;