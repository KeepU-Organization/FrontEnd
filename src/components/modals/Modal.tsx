import {ReactNode, useEffect, useRef} from 'react';
import { Modal as BSModal } from 'bootstrap';
import "./Modal.scss"
// Import the types explicitly
import 'bootstrap';

interface ModalProps {
    id: string;
    title: string;
    text: ReactNode;
    show?: boolean;
    onClose?: () => void;
}

const ModalComp = ({ id, title, text, show = false, onClose }: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const modalInstanceRef = useRef<BSModal | null>(null);

    useEffect(() => {
        // Only run in browser environment
        if (typeof window === 'undefined') return;

        const initModal = () => {
            if (!modalRef.current) return;

            // Create modal instance if it doesn't exist
            if (!modalInstanceRef.current) {
                modalInstanceRef.current = new BSModal(modalRef.current);

                // Add event listener for modal close
                if (onClose) {
                    modalRef.current.addEventListener('hidden.bs.modal', onClose);
                }
            }

            // Show or hide modal based on prop
            if (show) {
                modalInstanceRef.current.show();
            } else if (modalInstanceRef.current) {
                modalInstanceRef.current.hide();
            }
        };

        // Bootstrap might not be loaded immediately
        // if you're importing the CSS and JS in pages/_app.js
        // so we'll put this in a small timeout
        const timer = setTimeout(() => {
            initModal();
        }, 0);

        // Cleanup function
        return () => {
            clearTimeout(timer);

            if (modalRef.current && onClose) {
                modalRef.current.removeEventListener('hidden.bs.modal', onClose);
            }

            if (modalInstanceRef.current) {
                modalInstanceRef.current.dispose();
                modalInstanceRef.current = null;
            }
        };
    }, [id, show, onClose]);

    return (
        <div
            className="modal fade"
            id={id}
            data-bs-keyboard="false"
            tabIndex={-1}
            aria-labelledby={`${id}-label`}
            aria-hidden="true"
            ref={modalRef}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}-label`}>{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        {text}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline-primary"
                            data-bs-dismiss="modal"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalComp;