import React, { useState, useEffect } from 'react';
import { useWallets } from '../../../hooks/UseWallets';

import './Store.scss';

// Interfaces
interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    stock: number;
}

const Store: React.FC = () => {
    //const { user } = useAuth();
    const { wallets } = useWallets();

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWallet, setSelectedWallet] = useState<string>('');
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    // Simular carga de productos
    useEffect(() => {
        // Aquí conectarías con tu API real
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // Simulación de productos
                const mockProducts: Product[] = [
                    { id: 1, name: "Cuaderno premium", price: 15.50, imageUrl: "https://placehold.co/300x200/e9f5ff/1a73e8?text=Cuaderno", description: "Cuaderno con 100 hojas de alta calidad", stock: 20 },
                    { id: 2, name: "Lápices de colores (12)", price: 25.00, imageUrl: "https://placehold.co/300x200/fff5e9/e88c1a?text=Lápices", description: "Set de 12 lápices de colores", stock: 15 },
                    { id: 3, name: "Mochila escolar", price: 120.00, imageUrl: "https://placehold.co/300x200/f5e9ff/8c1ae8?text=Mochila", description: "Mochila resistente con varios compartimentos", stock: 8 },
                    { id: 4, name: "Calculadora científica", price: 75.00, imageUrl: "https://placehold.co/300x200/e9fff5/1ae88c?text=Calculadora", description: "Calculadora científica para estudiantes", stock: 12 },
                    { id: 5, name: "Borrador de goma", price: 3.50, imageUrl: "https://placehold.co/300x200/ffe9e9/e81a1a?text=Borrador", description: "Borrador de alta calidad", stock: 30 },
                    { id: 6, name: "Estuche escolar", price: 18.90, imageUrl: "https://placehold.co/300x200/e9eaff/1a1ae8?text=Estuche", description: "Estuche con cierre para lápices y bolígrafos", stock: 18 },
                ];

                setProducts(mockProducts);
                setFilteredProducts(mockProducts);

                // Inicializar cantidades en 1
                const initialQuantities: Record<number, number> = {};
                mockProducts.forEach(product => {
                    initialQuantities[product.id] = 1;
                });
                setQuantities(initialQuantities);

            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Establecer billetera predeterminada
    useEffect(() => {
        if (wallets.length > 0 && !selectedWallet) {
            setSelectedWallet(wallets[0].walletId);
        }
    }, [wallets, selectedWallet]);

    // Filtrar productos al buscar
    useEffect(() => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    // Manejar cambio de cantidad
    const handleQuantityChange = (productId: number, value: number) => {
        if (value >= 1) {
            setQuantities(prev => ({
                ...prev,
                [productId]: value
            }));
        }
    };

    // Manejar compra de producto
    const handleBuyProduct = (product: Product) => {
        const quantity = quantities[product.id];
        const totalPrice = product.price * quantity;

        // Aquí conectarías con tu API para realizar la compra
        console.log(`Comprando ${quantity} unidades de ${product.name} por S/.${totalPrice.toFixed(2)}`);

        // Mostrar un toast de confirmación (puedes implementar esto según tu sistema de notificaciones)
        alert(`¡Compra realizada! ${quantity} unidades de ${product.name} por S/.${totalPrice.toFixed(2)}`);
    };

    // Obtener saldo de la billetera seleccionada
    const getSelectedWalletBalance = () => {
        const wallet = wallets.find(w => w.walletId === selectedWallet);
        return Number(wallet ? wallet.balance : 0);
    };

    return (
        <div className="container py-4">
            {/* Barra superior con buscador y selector de billetera */}
            <div className="row mb-4 g-3 align-items-center">
                <div className="col-md-6">
                    <div className="input-group shadow-sm">
            <span className="input-group-text bg-white border-0">
              <i className="bi bi-search"></i>
            </span>
                        <input
                            type="text"
                            className="form-control border-0"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <select
                                        className="form-select border-0 bg-light"
                                        value={selectedWallet}
                                        onChange={(e) => setSelectedWallet(e.target.value)}
                                    >
                                        {wallets.map(wallet => (
                                            <option key={wallet.walletId} value={wallet.walletId}>
                                                Wallet {wallet.walletType}: {wallet.walletId}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="ms-3">
                  <span className="fw-bold text-primary fs-5">
                    <i className="bi bi-wallet2 me-2"></i>
                    S/.{getSelectedWalletBalance().toFixed(2)}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Catálogo de productos */}
            {isLoading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando productos...</p>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div key={product.id} className="col">
                                <div className="card h-100 border-0 shadow-sm product-card">
                                    <img
                                        src={product.imageUrl}
                                        className="card-img-top p-3"
                                        alt={product.name}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">{product.name}</h5>
                                        <p className="card-text text-muted small">{product.description}</p>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div className="input-group input-group-sm" style={{ maxWidth: '120px' }}>
                                                <button
                                                    className="btn btn-outline-secondary border-0"
                                                    type="button"
                                                    onClick={() => handleQuantityChange(product.id, quantities[product.id] - 1)}
                                                    disabled={quantities[product.id] <= 1}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>
                                                <input
                                                    type="number"
                                                    className="form-control text-center border-0 bg-light"
                                                    value={quantities[product.id]}
                                                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    max={product.stock}
                                                />
                                                <button
                                                    className="btn btn-outline-secondary border-0"
                                                    type="button"
                                                    onClick={() => handleQuantityChange(product.id, quantities[product.id] + 1)}
                                                    disabled={quantities[product.id] >= product.stock}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                            <h5 className="text-primary mb-0">S/.{product.price.toFixed(2)}</h5>
                                        </div>
                                    </div>
                                    <div className="card-footer bg-white border-0 p-3">
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={() => handleBuyProduct(product)}
                                            disabled={getSelectedWalletBalance() < product.price * quantities[product.id]}
                                        >
                                            <i className="bi bi-cart-plus me-2"></i>
                                            Comprar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center my-5">
                            <i className="bi bi-search fs-1 text-muted"></i>
                            <p className="mt-3">No se encontraron productos que coincidan con "{searchTerm}"</p>
                            <button
                                className="btn btn-outline-primary mt-2"
                                onClick={() => setSearchTerm('')}
                            >
                                Ver todos los productos
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Store;