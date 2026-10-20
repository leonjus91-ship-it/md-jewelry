'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Product {
    id: number
    title: string
    description: string | null
    price: number
    image_url: string
    category: string
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todas')
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])

    const whatsappNumber = '593000000000'

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .order('id', { ascending: false })

        if (error) {
            console.error('Error cargando productos:', error.message)
        } else if (data) {
            setProducts(data as Product[])
        }
        setLoading(false)
    }

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { product, quantity: 1 }]
        })
    }

    const removeFromCart = (id: number) => {
        setCart((prev) => prev.filter((item) => item.product.id !== id))
    }

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase())
        const matchesCategory =
            selectedCategory === 'Todas' ||
            p.category?.toLowerCase() === selectedCategory.toLowerCase()
        return matchesSearch && matchesCategory
    })

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    )

    const handleWhatsAppCheckout = () => {
        if (cart.length === 0) return

        let message = '✨ *NUEVO PEDIDO - MD JEWELRY* ✨\n\n'
        message += 'Hola, me gustaría realizar un pedido de los siguientes productos:\n\n'

        cart.forEach((item) => {
            message += `• *${item.product.title}* (x${item.quantity}) - $${(
                item.product.price * item.quantity
            ).toFixed(2)}\n`
        })

        message += `\n*Total a pagar:* $${cartTotal.toFixed(2)}\n\n`
        message += '¿Podrían confirmarme la disponibilidad y método de pago? Gracias 💕'

        const encodedMessage = encodeURIComponent(message)
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
    }

    const categories = ['Todas', 'Anillos', 'Cadenas', 'Pulseras', 'Aretes', 'Conjuntos']

    return (
        <div style={{ backgroundColor: '#fff5f7', color: '#4a3f43', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", width: '100%', overflowX: 'hidden' }}>

            {/* Estilo responsivo global inyectado */}
            <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
        }
        @media (max-width: 768px) {
          .main-container {
            grid-template-columns: 1fr !important;
            padding: 15px !important;
          }
          .header-container {
            flex-direction: column !important;
            gap: 15px !important;
            padding: 15px 20px !important;
            align-text: center !important;
          }
          .header-search {
            width: 100% !important;
          }
        }
      `}</style>

            {/* Header */}
            <header className="header-container" style={{ borderBottom: '2px solid #f2cfd9', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(212, 175, 55, 0.1)' }}>
                <h1 style={{ margin: 0, color: '#c59b27', letterSpacing: '2px', fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center' }}>MD JEWELRY</h1>
                <input
                    className="header-search"
                    type="text"
                    placeholder="Buscar joyas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '10px 18px', borderRadius: '25px', border: '1px solid #f2cfd9', backgroundColor: '#fff5f7', color: '#4a3f43', width: '260px', outline: 'none' }}
                />
            </header>

            <main className="main-container" style={{ padding: '30px 40px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>

                {/* Catálogo y Filtros */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #c59b27', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0, color: '#c59b27', fontSize: '1.4rem', fontWeight: '600' }}>Catálogo Exclusivo</h2>
                    </div>

                    {/* Botones de Filtro por Categoría (Desplazables en horizontal si son muchos) */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: '1px solid #c59b27',
                                    backgroundColor: selectedCategory === cat ? '#c59b27' : '#ffffff',
                                    color: selectedCategory === cat ? '#ffffff' : '#c59b27',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p style={{ color: '#8c7b83' }}>Cargando hermosas joyas...</p>
                    ) : filteredProducts.length === 0 ? (
                        <p style={{ marginTop: '20px', color: '#8c7b83' }}>No hay productos registrados en esta categoría.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
                            {filteredProducts.map((product) => (
                                <div key={product.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #f7d6e0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    {product.image_url && (
                                        <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                                    )}
                                    <div style={{ padding: '14px' }}>
                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#c59b27', fontWeight: 'bold', letterSpacing: '1px' }}>{product.category}</span>
                                        <h3 style={{ margin: '4px 0 6px 0', fontSize: '1rem', color: '#333333' }}>{product.title}</h3>
                                        <p style={{ color: '#7a6e74', fontSize: '0.82rem', height: '32px', overflow: 'hidden', marginBottom: '10px' }}>{product.description}</p>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#c59b27', margin: '8px 0' }}>${product.price}</p>
                                        <button
                                            onClick={() => addToCart(product)}
                                            style={{ width: '100%', padding: '10px', backgroundColor: '#c59b27', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Carrito de Compras */}
                <aside style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #f7d6e0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', height: 'fit-content' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#c59b27', borderBottom: '1px solid #f2cfd9', paddingBottom: '8px', fontSize: '1.1rem' }}>Tu Carrito</h3>
                    {cart.length === 0 ? (
                        <p style={{ color: '#8c7b83', fontSize: '0.9rem' }}>El carrito está vacío.</p>
                    ) : (
                        <div>
                            {cart.map((item) => (
                                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.9rem' }}>
                                    <div>
                                        <strong style={{ color: '#333' }}>{item.product.title}</strong> x{item.quantity}
                                        <div style={{ color: '#c59b27', fontWeight: 'bold' }}>${(item.product.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'transparent', border: 'none', color: '#e76f51', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>✕</button>
                                </div>
                            ))}
                            <hr style={{ borderColor: '#f2cfd9', margin: '12px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                                <span>Total:</span>
                                <span style={{ color: '#c59b27' }}>${cartTotal.toFixed(2)}</span>
                            </div>

                            {/* Botón de WhatsApp */}
                            <button
                                onClick={handleWhatsAppCheckout}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#25D366',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 10px rgba(37, 211, 102, 0.2)'
                                }}
                            >
                                📱 Pedir por WhatsApp
                            </button>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    )
}