import {useEffect, useRef, useState} from "react";
import axios from "axios";

import {walletService} from "../../services/WalletService.tsx";
import Toast from "../Toast.tsx";

// Interfaces para PayPal
interface PayPalButton {
  render: (element: HTMLElement | null) => void;
}

interface PayPalButtonsConstructor {
  Buttons: (config: PayPalButtonsConfig) => PayPalButton;
}

interface PayPalApproveData {
  orderID: string;
}

interface PayPalError {
  message?: string;
  stack?: string;
  [key: string]: unknown;
}

interface PayPalButtonsConfig {
  createOrder: () => Promise<string>;
  onApprove: (data: PayPalApproveData) => Promise<void>;
  onError: (err: PayPalError) => void;
}

// Declaración global actualizada
declare global {
  interface Window {
    paypal: PayPalButtonsConstructor;
  }
}
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1/';

const apiClient=axios.create({
  baseURL: API_BASE_URL,
  headers:{
    'Accept': 'application/json',
  }
})


const PayPalButton = ({ walletId, amount,onPaymentError,onPaymentSuccess }:
                      { walletId: string; amount: number,onPaymentError?: (message: string) => void; onPaymentSuccess?: () => void; } ) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    title: '',
    type: 'success' as 'success' | 'danger' | 'warning' | 'info'
  });
  const showToast = (title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success') => {
    setToast({
      show: true,
      title,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    // Asegúrate de que PayPal está cargado
    if (!window.paypal || !paypalRef.current) return;
    if (paypalRef.current) {
      paypalRef.current.innerHTML = '';
    }
    const buttonsInstance= window.paypal.Buttons({
      createOrder: async () => {
        try {
          const res = await apiClient.post("paypal/create-order", {
            amount: amount,
            walletId: walletId,
          });
          return res.data.orderId;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            onPaymentError?.(error.response.data.message);
            showToast('Error', error.response.data.message, 'danger');
          } else {
            onPaymentError?.("Error al crear la orden de pago");
            showToast('Error', "Error al crear la orden de pago", 'danger');
          }
          throw error;
        }
      },

      onApprove: async (data: PayPalApproveData) => {
        try {
          const orderId = data.orderID;
          const response = await walletService.depositToWallet(orderId, walletId);

          // Mostrar toast de éxito
          showToast('¡Pago Exitoso!', `Depósito realizado correctamente. Nuevo balance: s/.${response.balance}`);

          // Notificar al componente padre del éxito
          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            onPaymentError?.(error.response.data.message);
            showToast('Error', error.response.data.message, 'danger');
          } else {
            onPaymentError?.("Error al procesar el pago");
            showToast('Error', "Error al procesar el pago", 'danger');
          }
        }
      },

      onError: (err: PayPalError) => {
        console.error("Error con PayPal:", err);
        showToast('Error', "Error en el procesamiento del pago con PayPal", 'danger');
      },
    });

    buttonsInstance.render(paypalRef.current);
    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = '';
      }
    };
  }, [walletId, amount, onPaymentError]);

  return (
      <>
        <div ref={paypalRef}></div>
        <Toast
            show={toast.show}
            onClose={hideToast}
            title={toast.title}
            message={toast.message}
            type={toast.type}
        />
      </>
  );
};

export default PayPalButton;