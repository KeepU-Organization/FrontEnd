import React, {useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router";
import { useWallets } from "../../../hooks/UseWallets";
import {ParentHistoryService} from "../../../services/ParentHistoryService.tsx";
import {Transaction, TransactionResponse} from "../../../types/Transactions.tsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {MonitorChildrenService} from "../../../services/MonitorChildrenService.tsx";
import { useAuth } from "../../../hooks/UseAuth.tsx";

// Definir tipo para agrupamiento
type Grouping = 'day' | 'month' | 'year';

interface Child {
    id: number;
    name: string;
    age?: number;
    avatar?: string;
}

const SupervisingChildren: React.FC = () => {
    const location = useLocation();
    const childId = location.state?.childId;

    const {fetchChildrenWallets, childWallets} = useWallets();
    const [selectedWalletId, setSelectedWalletId] = useState<string>('');
    const [data, setData] = useState<Transaction[]>([]);
    const [groupBy, setGroupBy] = useState<Grouping>('month');

    const [children, setChildren] = useState<Child[]>([]);
    const [, setLoading] = useState<boolean>(true);
    const {user}=useAuth();

    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

// Función para alternar el estado del dropdown
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

// Función para cerrar el dropdown cuando se selecciona un hijo
    const handleChildSelect = (child: Child) => {
        const childName = child.name.replace(/\s+/g, '-').toLowerCase();
        navigate(`/monitor/${childName}`, { state: { childId: child.id } });
        setDropdownOpen(false);
    };

    // Cargar billeteras cuando se monta el componente
    useEffect(() => {
        if (childId) {
            const childIdNumber = parseInt(childId.toString(), 10);
            if (!isNaN(childIdNumber)) {
                fetchChildrenWallets(childIdNumber);
            }
        }
    }, [childId, fetchChildrenWallets]);

    // Seleccionar la primera billetera cuando se cargan
    useEffect(() => {
        if (childWallets.length > 0) {
            setSelectedWalletId(childWallets[0].walletId);
        }
    }, [childWallets]);

    // Cargar transacciones al cambiar la billetera seleccionada
    useEffect(() => {
        const fetchData = async () => {
            if (selectedWalletId) {
                const data = await ParentHistoryService.getParentHistory(selectedWalletId);

                const transformedData: Transaction[] = data.map((item: TransactionResponse, index: number) => ({
                    id: (index + 1).toString(),
                    amount: item.amount,
                    description: item.description,
                    type: item.transactionType,
                    date: item.transactionDate,
                    walletId: item.walletId,
                    walletName: item.walletName || 'Billetera principal'
                }));

                setData(transformedData);
            }
        };
        fetchData();
    }, [selectedWalletId]);

    useEffect(() => {
        setLoading(true);
        const fetchChildren = async () => {
            try {
                if (user) {
                    const childrenList = await MonitorChildrenService.getChildrenList(user?.id);
                    setChildren(childrenList);
                }
            } catch (error) {
                console.error('Error cargando datos de los hijos:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchChildren();
    }, [user]);

    // Formatear fechas según agrupamiento
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const day = d.toLocaleDateString();
        const month = `${d.getMonth() + 1}/${d.getFullYear()}`;
        const year = `${d.getFullYear()}`;

        if (groupBy === 'day') return day;
        if (groupBy === 'month') return month;
        return year;
    };

    // Agrupar transacciones por fecha
    const grouped: Record<string, { compra: number; transferencia: number }> = {};

    data.forEach((txn) => {
        const key = formatDate(txn.date);
        if (!grouped[key]) {
            grouped[key] = { compra: 0, transferencia: 0 };
        }

        if (txn.type === 'PURCHASE') {
            grouped[key].compra += txn.amount;
        } else if (txn.type === 'TRANSFER') {
            grouped[key].transferencia += txn.amount;
        }
    });

    const chartData = Object.entries(grouped).map(([date, amounts]) => ({
        date,
        ...amounts,
    }));

    return (
        <div className="container mt-5">
            <div className="row mb-4">
                <div className="col-md-8">
                    <h2 className="mb-3">Supervisión de Gastos</h2>
                    <p className="text-muted">Monitorea las transacciones de tus hijos y analiza sus patrones de gasto.</p>
                </div>
                <div className="col-md-4">
                    <div className="dropdown">
                        <button
                            className="btn btn-primary dropdown-toggle w-100"
                            type="button"
                            onClick={toggleDropdown}
                        >
                            {childId ? (children.find(c => c.id === Number(childId))?.name || `Hijo #${childId}`) : 'Seleccionar hijo'}
                        </button>
                        <ul className={`dropdown-menu w-100 ${dropdownOpen ? 'show' : ''}`}>
                            {children.map(child => (
                                <li key={child.id}>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => handleChildSelect(child)}
                                    >
                                        {child.name}
                                    </button>
                                </li>
                            ))}
                            {children.length === 0 && (
                                <li><span className="dropdown-item text-muted">No hay hijos disponibles</span></li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Transacciones</h5>
                            <select
                                className="form-select form-select-sm w-auto"
                                value={groupBy}
                                onChange={(e) => setGroupBy(e.target.value as Grouping)}
                            >
                                <option value="day">Por Día</option>
                                <option value="month">Por Mes</option>
                                <option value="year">Por Año</option>
                            </select>
                        </div>
                        <div className="card-body">
                            {chartData.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="bi bi-graph-up fs-1 text-muted"></i>
                                    <p className="mt-3 text-muted">No hay datos disponibles para mostrar.</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="compra" fill="#1e88e5" name="Compras" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Billeteras</h5>
                        </div>
                        <div className="card-body">
                            {childWallets.length === 0 ? (
                                <p className="text-muted text-center">No hay billeteras disponibles.</p>
                            ) : (
                                <div className="list-group">
                                    {childWallets.map((wallet) => (
                                        <button
                                            key={wallet.walletId}
                                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                                                selectedWalletId === wallet.walletId ? 'active' : ''
                                            }`}
                                            onClick={() => setSelectedWalletId(wallet.walletId)}
                                        >
                                            <span>{wallet.walletId || 'Billetera'}</span>
                                            <span className="badge bg-primary rounded-pill">S/. {wallet.balance}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Resumen</h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-group">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Total de transacciones
                                    <span className="badge bg-primary rounded-pill">{data.length}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    Compras
                                    <span className="badge bg-success rounded-pill">
                                        {data.filter(t => t.type === 'PURCHASE').length}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupervisingChildren;