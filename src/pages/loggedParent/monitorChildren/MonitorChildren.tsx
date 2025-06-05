import React, { useState, useEffect } from 'react';
import { Search, User, Eye, ArrowRightLeft, Activity, Bell } from 'lucide-react';
import { MonitorChildrenService } from "../../../services/MonitorChildrenService.tsx";
import { useAuth } from "../../../hooks/UseAuth.tsx";
import TransferMoney from "../../../components/modals/TransferMoney.tsx";

interface Child {
    id: number;
    name: string;
    age?: number;
    avatar?: string;
}

const MonitorChildren: React.FC = () => {
    const [children, setChildren] = useState<Child[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

    useEffect(() => {
        // Asegurar que el scroll esté habilitado
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        return () => {
            // Restaurar cuando se desmonte el componente
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);
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

    // Filtrar hijos por nombre
    const filteredChildren = children.filter(child =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSupervise = (child: Child) => {
        console.log(`Supervisando a ${child.name}`);
        alert(`Supervisando a ${child.name}`);
    };

    const handleTransfer = (child:Child) => {
        setSelectedChildId(child.id);
    };

    // Función para obtener un color aleatorio para cada tarjeta
    const getRandomColor = (index: number) => {
        const colors = ["primary", "success", "danger", "warning", "info"];
        return colors[index % colors.length];
    };

    return (
        <div className="container py-5">
            {/* Encabezado con estilo moderno */}
            <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
                    <User size={28} className="text-primary" />
                </div>
                <h1 className="display-4 fw-bold mb-2">Gestión de <span className="text-primary">Hijos</span></h1>
                <p className="lead text-muted mx-auto" style={{ maxWidth: "700px" }}>
                    Administra y supervisa a los hijos registrados en el sistema
                </p>
            </div>

            {/* Buscador con estilo mejorado */}
            <div className="row justify-content-center mb-5">
                <div className="col-lg-6">
                    <div className="input-group input-group-lg shadow-sm rounded-pill overflow-hidden">
                        <span className="input-group-text border-0 bg-white ps-4">
                            <Search size={20} className="text-primary" />
                        </span>
                        <input
                            type="text"
                            className="form-control border-0 py-3"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tarjetas de estadísticas */}
            {!loading && children.length > 0 && (
                <div className="row mb-5">
                    <div className="col-md-4 mb-4 mb-md-0">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                                    <User size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1">Total de hijos</h6>
                                    <h3 className="fw-bold mb-0">{children.length}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4 mb-md-0">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                                    <Activity size={24} className="text-success" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1">Activos hoy</h6>
                                    <h3 className="fw-bold mb-0">{Math.ceil(children.length * 0.8)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body d-flex align-items-center">
                                <div className="bg-danger bg-opacity-10 p-3 rounded-3 me-3">
                                    <Bell size={24} className="text-danger" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1">Notificaciones</h6>
                                    <h3 className="fw-bold mb-0">{Math.floor(Math.random() * 5)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de hijos */}
            {loading ? (
                <div className="card border-0 shadow-sm p-5 text-center">
                    <div className="spinner-border text-primary mx-auto mb-3" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="text-muted mb-0">Cargando información de los hijos...</p>
                </div>
            ) : filteredChildren.length === 0 ? (
                <div className="card border-0 shadow-sm p-5 text-center">
                    <div className="text-muted mb-4">
                        <User size={64} className="opacity-25" />
                    </div>
                    <h4 className="fw-bold mb-2">
                        {searchTerm ? 'No se encontraron hijos con ese nombre' : 'No hay hijos registrados'}
                    </h4>
                    <p className="text-muted">
                        {searchTerm ? 'Intenta con otra búsqueda' : 'Registra un hijo para comenzar'}
                    </p>
                </div>
            ) : (
                <div className="row g-4">
                    {filteredChildren.map((child, index) => {
                        const color = getRandomColor(index);
                        return (
                            <div key={child.id} className="col-md-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100"
                                     style={{
                                         transition: "all 0.3s ease",
                                         borderRadius: "15px",
                                         overflow: "hidden"
                                     }}>
                                    {/* Cabecera con color */}
                                    <div className={`card-img-top bg-${color}`} style={{ height: "80px" }}>
                                        {child.age && (
                                            <span className="badge bg-white text-dark position-absolute end-0 m-3">
                                                {child.age} años
                                            </span>
                                        )}
                                    </div>

                                    <div className="position-relative">
                                        <div className="position-absolute" style={{ top: "-40px", left: "20px" }}>
                                            <div className="border border-4 border-white rounded-circle" style={{ width: "80px", height: "80px" }}>
                                                <div className={`d-flex align-items-center justify-content-center bg-${color} w-100 h-100 rounded-circle`}>
                                                    <User size={40} className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-body pt-5">
                                        <h5 className="fw-bold mb-1">{child.name}</h5>
                                        <p className="text-muted small mb-4">ID: #{child.id}</p>

                                        <div className="d-grid gap-2">
                                            <button
                                                onClick={() => handleSupervise(child)}
                                                className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                                                style={{ borderRadius: "10px" }}
                                            >
                                                <Eye size={18} />
                                                <span>Supervisar</span>
                                            </button>

                                            <button
                                                onClick={() => handleTransfer(child)}
                                                className="btn btn-success d-flex align-items-center justify-content-center gap-2"
                                                style={{ borderRadius: "10px" }}
                                            >
                                                <ArrowRightLeft size={18} />
                                                <span>Transferir</span>
                                            </button>



                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {selectedChildId !== null && (
                        <TransferMoney
                            id={'childTransfer'}
                            title={"Transferencia"}
                            childId={selectedChildId.toString()}
                            childName={children.find(child => child.id === selectedChildId)?.name}
                            show={true}
                            onClose={() => setSelectedChildId(null)}
                        />
                    )}

                </div>
            )}

            {/* Información de resultados */}
            {!loading && filteredChildren.length > 0 && (
                <div className="text-center mt-4 text-muted">
                    Mostrando <span className="fw-bold">{filteredChildren.length}</span> de <span className="fw-bold">{children.length}</span> hijos
                </div>
            )}

        </div>
    );
};

export default MonitorChildren;