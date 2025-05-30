import React from 'react';

import './loadingStyles.css';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
    text?: string;
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
                                             size = 'md',
                                             variant = 'primary',
                                             text = 'Cargando...',
                                             className = ''
                                         }) => {
    return (
        <div className={`spinner-container ${className}`}>
            <div
                className={`custom-spinner spinner-${size} spinner-${variant}`}
                role="status"
                aria-hidden="true"
            />
            {text && (
                <small className="text-muted pulse-text">
                    {text}
                </small>
            )}
        </div>
    );
};

// Exportamos también LoadingCard para que esté disponible
export const LoadingCard: React.FC<{
    title: string;
    isLoading: boolean;
    children?: React.ReactNode
}> = ({
          title,
          isLoading,
          children
      }) => {
    return (
        <div className="card" style={{ height: '100%' }}>
            <div className="card-body" style={{
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {isLoading ? (
                    <Spinner text={`Cargando ${title.toLowerCase()}...`} />
                ) : (
                    <>
                        <h5 className="card-title">{title}</h5>
                        {children || <p className="card-text">Contenido cargado exitosamente!</p>}
                    </>
                )}
            </div>
        </div>
    );
};

export const LoadingComponent: React.FC = () => {
    return (
        <div className="loading-screen">
            <Spinner size="lg" variant="primary" text="Cargando..." />
        </div>
    );
};