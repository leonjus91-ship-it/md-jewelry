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
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([])

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

    const filteredProducts = products.filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
    )

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    )

    return (
        <div style={{ backgroundColor: '#0f0f11', color: '#f0f0f0', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            {/* Header */}
            <header style={{ borderBottom: '1px solid #222', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#141416' }}>
                <h1 style={{ margin: 0, color: '#d4af37', letterSpacing: '2px', fontSize: '1.8rem' }}>MD JEWELRY</h1>
                <input
                    type="text"
                    placeholder="Buscar joyas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #333', backgroundColor: '#1e1e22', color: '#fff', width: '250px' }}
                />
            </header>

            <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
                {/* Catálogo de Productos */}
                <section>
                    <h2 style={{ borderBottom: '2px solid #d4af37', paddingBottom: '10px', color: '#d4af37' }}>Catálogo Exclusivo</h2>

                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : filteredProducts.length === 0 ? (
                        <p style={{ marginTop: '20px', color: '#888' }}>No hay productos registrados todavía.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
                            {filteredProducts.map((product) => (
                                <div key={product.id} style={{ backgroundColor: '#18181c', borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    {product.image_url && (
                                        <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                                    )}
                                    <div style={{ padding: '15px' }}>
                                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#fff' }}>{product.title}</h3>
                                        <p style={{ color: '#aaa', fontSize: '0.85rem', height: '36px', overflow: 'hidden' }}>{product.description}</p>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#d4af37', margin: '10px 0' }}>${product.price}</p>
                                        <button
                                            onClick={() => addToCart(product)}
                                            style={{ width: '100%', padding: '10px', backgroundColor: '#d4af37', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
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
                <aside style={{ backgroundColor: '#18181c', padding: '20px', borderRadius: '8px', border: '1px solid #2a2a30', height: 'fit-content' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#d4af37', borderBottom: '1px solid #333', paddingBottom: '10px' }}>Tu Carrito</h3>
                    {cart.length === 0 ? (
                        <p style={{ color: '#888' }}>El carrito está vacío.</p>
                    ) : (
                        <div>
                            {cart.map((item) => (
                                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '0.9rem' }}>
                                    <div>
                                        <strong>{item.product.title}</strong> x{item.quantity}
                                        <div style={{ color: '#d4af37' }}>${item.product.price * item.quantity}</div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                                </div>
                            ))}
                            <hr style={{ borderColor: '#333', margin: '15px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px' }}>
                                <span>Total:</span>
                                <span style={{ color: '#d4af37' }}>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                </aside>
            </main>
        </div>
    )
}