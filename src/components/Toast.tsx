// src/components/ui/Toast.tsx
import React, { useEffect, useState } from 'react';
import { Toast as BootstrapToast } from 'bootstrap';

interface ToastProps {
    show: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'danger' | 'warning' | 'info';
}

const Toast: React.FC<ToastProps> = ({ show, onClose, title, message, type = 'success' }) => {
    const [toastElement, setToastElement] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (toastElement) {
            const toast = new BootstrapToast(toastElement);
            if (show) {
                toast.show();
            } else {
                toast.hide();
            }
        }
    }, [show, toastElement]);

    const bgClass = `bg-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'info'}`;
    const textClass = type === 'danger' || type === 'success' ? 'text-white' : '';

    return (
        <div
            className={`toast position-fixed bottom-0 end-0 m-3 ${bgClass} ${textClass}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            ref={setToastElement}
        >
            <div className={`toast-header ${bgClass} ${textClass}`}>
                <strong className="me-auto">{title}</strong>
                <small>Ahora</small>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    );
};

export default Toast;