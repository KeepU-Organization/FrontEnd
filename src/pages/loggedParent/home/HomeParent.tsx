import {useEffect, useState} from 'react';
import './HomeParent.scss'; // Importar estilos específicos si es necesario

import AddChildModal from "../../../components/modals/AddChildModal.tsx";
import {useWallets} from "../../../hooks/UseWallets.tsx";
import DepositModal from "../../../components/modals/DepositModal.tsx";
import {ParentHistoryService} from "../../../services/ParentHistoryService.tsx";
import EditSpendingLimitModal from "../../../components/modals/EditSpendingLimitModal.tsx";

import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {Transaction, TransactionResponse} from "../../../types/Transactions.tsx";


type Grouping = 'day' | 'month' | 'year';

const HomeParent = () => {
    const [showAmount, setShowAmount] = useState(false);

    const [showChildModal, setShowChildModal] = useState(false)
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [data, setData] = useState<Transaction[]>([]);
    const [groupBy, setGroupBy] = useState<Grouping>('day');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showLimitModal, setShowLimitModal] = useState(false);


    const toggleAmountVisibility = () => {
        setShowAmount(!showAmount);
    };

    const addChild = () => {
        setShowChildModal(true);
    }
    const deposit = () => {
        setShowDepositModal(true);
    }

    const { wallets, refreshWallets } = useWallets();
    const walletId = wallets.length > 0 ? wallets[0].walletId : '';
    const wallet= wallets.length > 0 ? wallets[0] : null;
    const balance= wallet ? wallet.balance : 0;

    // Función para cerrar el modal y refrescar datos
    const handleCloseDepositModal = () => {
        setShowDepositModal(false);
        // Recargar wallets cuando se cierra el modal
        refreshWallets();
        setRefreshTrigger(prev => prev + 1);
    }

    //GRAFICOS:

    useEffect(() => {
        const fetchData = async () => {
            if (walletId) {  // Verificamos que haya un walletId válido
                const data = await ParentHistoryService.getParentHistory(walletId);

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
    }, [walletId, refreshTrigger]);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const day = d.toLocaleDateString();             // dd/mm/yyyy
        const month = `${d.getMonth() + 1}/${d.getFullYear()}`; // mm/yyyy
        const year = `${d.getFullYear()}`;              // yyyy

        if (groupBy === 'day') return day;
        if (groupBy === 'month') return month;
        return year;
    };
    const grouped: Record<
        string,
        { deposito: number; transferencia: number }
    > = {};

    data.forEach((txn) => {
        const key = formatDate(txn.date);
        if (!grouped[key]) {
            grouped[key] = { deposito: 0, transferencia: 0 };
        }
        if (txn.type === 'DEPOSIT') {
            grouped[key].deposito += txn.amount;
        } else if (txn.type === 'TRANSFER') {
            grouped[key].transferencia += txn.amount;
        }
    });

    const chartData = Object.entries(grouped).map(([date, amounts]) => ({
        date,
        ...amounts,
    }));

    return (
        <div className="container-fluid p-4" style={{marginTop: '80px'}} >
            {/* Primera fila: Monto, botones */}
            <div className="row mb-4 align-items-center">
                <div className="col-auto">
                    <div className="bg-info bg-opacity-25 border border-info rounded-pill px-4 py-2 d-flex align-items-center">
                        <span className="me-3 fw-semibold">
                            Monto: s/.{showAmount ? balance : '****'}
                        </span>
                        <button
                            className="btn btn-sm btn-outline-info me-2"
                            onClick={toggleAmountVisibility}
                            title={showAmount ? 'Ocultar monto' : 'Mostrar monto'}
                        >
                            {showAmount ? (
                                <i className="bi bi-eye-slash"></i>
                            ) : (
                                <i className="bi bi-eye"></i>
                            )}
                        </button>
                        <button
                            className="btn btn-sm btn-outline-info"
                            title="Agregar monto"
                            onClick={deposit}
                        >
                            <i className="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
                {/* Agregar Limites de hijos */}
                {/* Mostrar lista de hijos con botón para editar límite */}
                <div className="col-auto">
                    <button className="btn btn-outline-primary" onClick={() => setShowLimitModal(true)}>
                        Establecer Límite de Gasto
                    </button>
                </div>
                <div className="col-auto">
                    <button className="btn btn-outline-secondary">
                        Clave de Seguridad
                    </button>
                </div>
            </div>

            {/* Segunda fila: Gráficos */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Gráfico Principal</h5>
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
                        <div className="card-body d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                            {chartData.length === 0 ? (
                                <div className="text-muted text-center">
                                    <i className="bi bi-bar-chart fs-1 d-block mb-2"></i>
                                    <p>Espacio para gráficos de barras/líneas</p>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="deposito" fill="#198754" name="Depósitos" />
                                        <Bar dataKey="transferencia" fill="#dc3545" name="Transferencias" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Gráfico Secundario</h5>
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center" style={{minHeight: '300px'}}>
                            <div className="text-muted">
                                <i className="bi bi-pie-chart fs-1 d-block text-center mb-2"></i>
                                <p className="text-center">Espacio para otro tipo de gráfico</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tercera fila: Botón agregar hijos */}
            <div className="row">
                <div className="col-auto">
                    <button className="btn btn-success" style={{color:"white"}} onClick={addChild} >
                        <i className="bi bi-person-plus me-2"></i>
                        Agregar Hijos
                    </button>
                </div>
            </div>

            {/* Modal para agregar hijos */}
            <AddChildModal
                id={'addChild'}
                title={'Agregar hijos'}
                show={showChildModal}
                onClose={() => setShowChildModal(false)}
            ></AddChildModal>
            <DepositModal
                id={'depositModal'}
                title={'Agregar Monto'}
                show={showDepositModal}
                onClose={handleCloseDepositModal}
            ></DepositModal>

            {/* Agregar Limites de hijos */}
            {/* Modal para Limite de gastos */}
            {showLimitModal && (
                <EditSpendingLimitModal
                    show={showLimitModal}
                    onClose={() => setShowLimitModal(false)}
                />
            )}

        </div>
    );
};

export default HomeParent;