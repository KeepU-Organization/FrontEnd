import  { useState } from 'react';
import './HomeParent.scss'; // Importar estilos específicos si es necesario

import AddChildModal from "../../../components/modals/AddChildModal.tsx";
const HomeParent = () => {
    const [showAmount, setShowAmount] = useState(false);

    const [showModal, setShowModal] = useState(false);
    
    const toggleAmountVisibility = () => {
        setShowAmount(!showAmount);
    };

    const addChild = () => {
        setShowModal(true);
    }
    
    return (
        <div className="container-fluid p-4" style={{marginTop: '80px'}} >
            {/* Primera fila: Monto, botones */}
            <div className="row mb-4 align-items-center">
                <div className="col-auto">
                    <div className="bg-info bg-opacity-25 border border-info rounded-pill px-4 py-2 d-flex align-items-center">
                        <span className="me-3 fw-semibold">
                            Monto: {showAmount ? '$1,234.56' : '****'}
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
                        >
                            <i className="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
                <div className="col-auto">
                    <button className="btn btn-outline-primary me-2">
                        Editar Límite
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
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-center" style={{minHeight: '300px'}}>
                            <div className="text-muted">
                                <i className="bi bi-bar-chart fs-1 d-block text-center mb-2"></i>
                                <p className="text-center">Espacio para gráficos de barras/líneas</p>
                            </div>
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
                show={showModal}
                onClose={() => setShowModal(false)}
            ></AddChildModal>
            
        </div>
    );
};

export default HomeParent;