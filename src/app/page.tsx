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
            padding: 10px !important;
          }
          .hero-section {
            padding: 40px 15px !important;
          }
          .hero-title {
            font-size: 1.8rem !important;
          }
          .header-container {
            flex-direction: column !important;
            gap: 12px !important;
            padding: 15px 10px !important;
            text-align: center !important;
          }
          .nav-links {
            gap: 12px !important;
            font-size: 0.75rem !important;
            flex-wrap: wrap;
            justify-content: center;
          }
          .header-search {
            width: 100% !important;
          }
        }
      `}</style>

            {/* Header optimizado para móviles */}
            <header className="header-container" style={{ borderBottom: '2px solid #f2cfd9', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(212, 175, 55, 0.1)' }}>
                <h1 style={{ margin: 0, color: '#d4af37', letterSpacing: '2px', fontSize: '1.5rem', fontWeight: 'bold' }}>MD JEWELRY</h1>
                <div className="nav-links" style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.85rem', fontWeight: '600', color: '#6b5b63' }}>
                    <span style={{ cursor: 'pointer', color: '#d4af37' }}>INICIO</span>
                    <span style={{ cursor: 'pointer' }}>COLECCIÓN</span>
                    <span style={{ cursor: 'pointer' }}>NOSOTROS</span>
                    <span
                        onClick={handleWhatsAppCheckout}
                        style={{ cursor: 'pointer', color: '#d4af37', letterSpacing: '0.5px' }}
                    >
                        PEDIDOS POR WHATSAPP
                    </span>
                </div>
            </header>

            {/* Hero Banner */}
            <section className="hero-section" style={{ backgroundColor: '#2c2226', color: '#ffffff', padding: '50px 20px', textAlign: 'center', borderBottom: '4px solid #d4af37' }}>
                <p style={{ color: '#d4af37', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 'bold' }}>
                    ELEGANCIA Y DISTINCIÓN
                </p>
                <h2 className="hero-title" style={{ fontSize: '2.3rem', color: '#d4af37', letterSpacing: '1px', margin: '0 0 12px 0', fontWeight: '700' }}>
                    BRILLO QUE SE LLEVA
                </h2>
                <p style={{ color: '#dcd1d6', maxWidth: '600px', margin: '0 auto 25px auto', fontSize: '0.9rem', lineHeight: '1.4' }}>
                    Encuentra joyas exclusivas con diseños únicos. Anillos delicados, cadenas deslumbrantes y conjuntos perfectos para cada ocasión.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
                        style={{ padding: '10px 24px', backgroundColor: '#d4af37', color: '#ffffff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        VER COLECCIÓN
                    </button>
                    <button
                        onClick={handleWhatsAppCheckout}
                        style={{ padding: '10px 24px', backgroundColor: 'transparent', color: '#d4af37', border: '1px solid #d4af37', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                        PEDIR POR WHATSAPP
                    </button>
                </div>
            </section>

            <main className="main-container" style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '25px' }}>

                {/* Catálogo y Filtros */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #d4af37', paddingBottom: '10px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                        <h3 style={{ margin: 0, color: '#d4af37', fontSize: '1.3rem', fontWeight: '600' }}>Catálogo Exclusivo</h3>
                        <input
                            className="header-search"
                            type="text"
                            placeholder="Buscar joyas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ padding: '8px 14px', borderRadius: '20px', border: '1px solid #f2cfd9', backgroundColor: '#ffffff', color: '#4a3f43', width: '200px', outline: 'none', fontSize: '0.9rem' }}
                        />
                    </div>

                    {/* Botones de Filtro por Categoría */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '7px 15px',
                                    borderRadius: '20px',
                                    border: '1px solid #d4af37',
                                    backgroundColor: selectedCategory === cat ? '#d4af37' : '#ffffff',
                                    color: selectedCategory === cat ? '#ffffff' : '#d4af37',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
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
                                        <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                                    )}
                                    <div style={{ padding: '12px' }}>
                                        <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#d4af37', fontWeight: 'bold', letterSpacing: '1px' }}>{product.category}</span>
                                        <h4 style={{ margin: '4px 0 6px 0', fontSize: '0.95rem', color: '#333333' }}>{product.title}</h4>
                                        <p style={{ color: '#7a6e74', fontSize: '0.8rem', height: '30px', overflow: 'hidden', marginBottom: '8px' }}>{product.description}</p>
                                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#d4af37', margin: '6px 0' }}>${product.price}</p>
                                        <button
                                            onClick={() => addToCart(product)}
                                            style={{ width: '100%', padding: '9px', backgroundColor: '#d4af37', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer' }}
                                        >
                                            Agregar al Carrito
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Carrito de Compras */}
                <aside style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #f7d6e0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', height: 'fit-content' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#d4af37', borderBottom: '1px solid #f2cfd9', paddingBottom: '8px', fontSize: '1.05rem' }}>Tu Carrito</h3>
                    {cart.length === 0 ? (
                        <p style={{ color: '#8c7b83', fontSize: '0.85rem' }}>El carrito está vacío.</p>
                    ) : (
                        <div>
                            {cart.map((item) => (
                                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.85rem' }}>
                                    <div>
                                        <strong style={{ color: '#333' }}>{item.product.title}</strong> x{item.quantity}
                                        <div style={{ color: '#d4af37', fontWeight: 'bold' }}>${(item.product.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'transparent', border: 'none', color: '#e76f51', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>✕</button>
                                </div>
                            ))}
                            <hr style={{ borderColor: '#f2cfd9', margin: '10px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>
                                <span>Total:</span>
                                <span style={{ color: '#d4af37' }}>${cartTotal.toFixed(2)}</span>
                            </div>

                            {/* Botón de WhatsApp */}
                            <button
                                onClick={handleWhatsAppCheckout}
                                style={{
                                    width: '100%',
                                    padding: '11px',
                                    backgroundColor: '#25D366',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
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