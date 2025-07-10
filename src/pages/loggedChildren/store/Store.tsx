import React, { useState, useEffect } from 'react';
import { useWallets } from '../../../hooks/UseWallets';

import './Store.scss';
import { useStores } from "../../../hooks/UseStores.tsx";
import { UseGiftCards } from "../../../hooks/UseGiftCards.tsx";
import BuyModal from "../../../components/modals/BuyModal.tsx";
import { walletService } from "../../../services/WalletService.tsx";

import steamLogo from '../../../assets/steam_card.png';
import riotLogo from '../../../assets/riot_card.png';
import ripleyLogo from '../../../assets/ripley_card.png';
// Interfaces
interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    stock: number;
    storeId: number;
    type: string;
    link: string;
}
interface GiftCard {
    id?: number;
    storeId: number;
    amount: number;
    code?: string;
}


const storeLogos: Record<number, string> = {
    1: steamLogo,
    2: riotLogo,
    3: ripleyLogo,
};

const Store: React.FC = () => {
    const { wallets, refreshWallets } = useWallets();

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWallet, setSelectedWallet] = useState<string>('');
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const { giftcards, fetchGiftCards } = UseGiftCards();
    const { stores, fetchStores } = useStores();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const loadStores = async () => {
            setLoading(true);
            if (stores.length === 0) {
                await fetchStores();
            }
        }
        loadStores();
    }, [fetchStores]);
    useEffect(() => {
        const loadGiftCards = async () => {
            setLoading(true);
            if (giftcards.length === 0) {
                await fetchGiftCards();
            }
        }
        loadGiftCards();
    }, [fetchGiftCards, giftcards.length]);

    useEffect(() => {
        const prepareProducts = () => {
            setLoading(true);
            try {
                if (stores.length > 0) {
                    // Agrupar tarjetas por storeId para calcular stock
                    const giftcardsByStore: Record<string, GiftCard[]> = {};

                    giftcards.forEach(giftcard => {
                        const storeIdKey = String(giftcard.storeId);
                        if (!giftcardsByStore[storeIdKey]) {
                            giftcardsByStore[storeIdKey] = [];
                        }
                        giftcardsByStore[storeIdKey].push(giftcard);
                    });

                    // Crear productos para todas las tiendas
                    const newProducts: Product[] = [];
                    let productId = 1;

                    stores.forEach(store => {
                        const storeIdKey = String(store.id);
                        // Verificar si hay tarjetas disponibles
                        const hasStock = giftcardsByStore[storeIdKey] && giftcardsByStore[storeIdKey].length > 0;

                        // Usar logo real si existe, si no, placeholder
                        newProducts.push({
                            id: productId++,
                            name: store.name,
                            price: hasStock ? parseFloat(String(giftcardsByStore[storeIdKey][0].amount)) : 0,
                            imageUrl: storeLogos[store.id] || `https://placehold.co/300x200?text=${encodeURIComponent(store.name)}`,
                            description: store.location || 'Ubicación no disponible',
                            stock: hasStock ? giftcardsByStore[storeIdKey].length : 0,
                            storeId: store.id,
                            type: store.type,
                            link: store.link || '#'
                        });
                    });

                    setProducts(newProducts);
                    setFilteredProducts(newProducts);

                    // Inicializar cantidades en 1
                    const initialQuantities: Record<number, number> = {};
                    newProducts.forEach(product => {
                        initialQuantities[product.id] = 1;
                    });
                    setQuantities(initialQuantities);
                }
            } catch (error) {
                console.error("Error al preparar productos:", error);
            } finally {
                setLoading(false);
            }
        };

        prepareProducts();
    }, [stores, giftcards]);

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
    const handleBuyProduct = async (product: Product): Promise<boolean> => {
        const quantity = quantities[product.id];
        const totalPrice = product.price * quantity;

        if (getSelectedWalletBalance() < totalPrice) {
            return false;
        }
        if (product.stock === 0) {
            return false;
        }
        try {
            await walletService.purchaseGiftCard({
                walletId: selectedWallet,
                storeId: product.storeId,
                quantity: quantity,
                amount: totalPrice
            });

            // Actualizar el stock del producto
            setProducts(prevProducts =>
                prevProducts.map(p =>
                    p.id === product.id ? { ...p, stock: p.stock - quantity } : p
                )
            );

        } catch (error) {
            console.error("Error al comprar el producto:", error);
            alert('Error al procesar la compra. Inténtalo de nuevo más tarde.');
            return false;
        }
        return true;
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
                        <span className="input-group-text border-0">
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
                                        className="form-select border-0"
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
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando productos...</p>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="col">
                            <div className={`card h-100 border-0 shadow-sm product-card ${product.stock === 0 ? 'product-unavailable' : ''}`}>
                                <img
                                    src={product.imageUrl}
                                    className="card-img-top p-3"
                                    alt={product.name}
                                    onClick={() => window.open(product.link, '_blank')}
                                    style={{ objectFit: 'contain', height: '200px' }}
                                />
                                {product.stock === 0 && (
                                    <div className="unavailable-overlay">
                                        <span className="badge bg-danger">No disponible</span>
                                    </div>
                                )}
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{product.name} Giftcard</h5>
                                    <p className="card-text text-muted small">{product.description}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div className="input-group input-group-sm" style={{ maxWidth: '120px' }}>
                                            <button
                                                className="btn btn-outline-secondary border-0"
                                                type="button"
                                                onClick={() => handleQuantityChange(product.id, quantities[product.id] - 1)}
                                                disabled={quantities[product.id] <= 1 || product.stock === 0}
                                            >
                                                <i className="bi bi-dash"></i>
                                            </button>
                                            <input
                                                type="number"
                                                className="form-control text-center border-0"
                                                value={quantities[product.id]}
                                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                                                min="1"
                                                max={product.stock}
                                                disabled={product.stock === 0}
                                            />
                                            <button
                                                className="btn btn-outline-secondary border-0"
                                                type="button"
                                                onClick={() => handleQuantityChange(product.id, quantities[product.id] + 1)}
                                                disabled={quantities[product.id] >= product.stock || product.stock === 0}
                                            >
                                                <i className="bi bi-plus"></i>
                                            </button>
                                        </div>
                                        <h5 className="text-primary mb-0">
                                            {product.stock > 0 ? `S/.${product.price.toFixed(2)}` : '--'}
                                        </h5>
                                    </div>
                                </div>
                                <div className="card-footer border-0 p-3">
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setShowModal(true);
                                        }}
                                        disabled={product.stock === 0 || getSelectedWalletBalance() < product.price * quantities[product.id]}
                                    >
                                        {product.stock === 0 ? (
                                            <>
                                                <i className="bi bi-x-circle me-2"></i>
                                                Agotado
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-cart-plus me-2"></i>
                                                Comprar
                                            </>
                                        )}
                                    </button>
                                    {(getSelectedWalletBalance() < product.price * quantities[product.id]) ?
                                        <div className="text-danger small mt-2"> Saldo insuficiente</div> :
                                        <></>
                                    }
                                </div>
                            </div>
                            {selectedProduct && (
                                <BuyModal
                                    onConfirm={() => handleBuyProduct(selectedProduct)}
                                    isOpen={showModal}
                                    onClose={() => {
                                        setShowModal(false);
                                        setSelectedProduct(null);
                                        refreshWallets();
                                        fetchGiftCards();
                                        fetchStores();
                                    }}
                                    productName={selectedProduct.name}
                                    quantity={quantities[selectedProduct.id]}
                                    totalPrice={selectedProduct.price * quantities[selectedProduct.id]}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Store;