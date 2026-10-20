'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Definimos la estructura de un producto
interface Producto {
    id: string
    nombre: string
    descripcion: string
    precio: number
    imagen_url: string
    categoria: string
    stock: number
}

export default function TiendaMDJewelry() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoading] = useState(true)
    const [carrito, setCarrito] = useState<Producto[]>([])
    const [busqueda, setBusqueda] = useState('')

    // Cargar productos desde Supabase al iniciar
    useEffect(() => {
        async function obtenerProductos() {
            try {
                const { data, error } = await supabase.from('productos').select('*')
                if (error) {
                    console.error('Error al cargar productos:', error.message)
                } else if (data) {
                    setProductos(data)
                }
            } catch (err) {
                console.error('Error inesperado:', err)
            } finally {
                setLoading(false)
            }
        }
        obtenerProductos()
    }, [])

    // Agregar producto al carrito
    const agregarAlCarrito = (producto: Producto) => {
        setCarrito([...carrito, producto])
    }

    // Quitar producto del carrito
    const quitarDelCarrito = (index: number) => {
        const nuevoCarrito = carrito.filter((_, i) => i !== index)
        setCarrito(nuevoCarrito)
    }

    // Enviar pedido por WhatsApp
    const enviarPedidoWhatsApp = () => {
        if (carrito.length === 0) return

        let mensaje = 'Hola MD Jewelry, quiero realizar el siguiente pedido:\n\n'
        let total = 0

        carrito.forEach((item, idx) => {
            mensaje += `${idx + 1}. *${item.nombre || 'Producto'}* - $${Number(item.precio || 0).toFixed(2)}\n`
            total += Number(item.precio || 0)
        })

        mensaje += `\n*Total a pagar: $${total.toFixed(2)}*\n\n¡Quedo a la espera de las instrucciones de pago y envío!`

        // Número de WhatsApp de la tienda
        const telefono = '593999999999'
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
        window.open(url, '_blank')
    }

    // Filtrar productos según la búsqueda de forma segura
    const productosFiltrados = productos.filter(p =>
        (p.nombre && p.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
        (p.categoria && p.categoria.toLowerCase().includes(busqueda.toLowerCase()))
    )

    return (
        <div style={{ backgroundColor: '#fdfbf7', minHeight: '100vh', fontFamily: 'sans-serif', color: '#2c2c2c' }}>

            {/* HEADER / NAVEGACIÓN */}
            <header style={{
                backgroundColor: '#1a1a1a',
                color: '#fff',
                padding: '20px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '2px', color: '#d4af37' }}>MD JEWELRY</h1>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Buscar joyas..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{
                            padding: '8px 15px',
                            borderRadius: '20px',
                            border: '1px solid #d4af37',
                            backgroundColor: '#2a2a2a',
                            color: '#fff',
                            outline: 'none',
                            width: '220px'
                        }}
                    />
                    <div style={{ backgroundColor: '#d4af37', color: '#1a1a1a', padding: '6px 14px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                        🛒 Carrito ({carrito.length})
                    </div>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '40px' }}>

                {/* SECCIÓN DEL CATÁLOGO */}
                <div style={{ flex: 2 }}>
                    <h2 style={{ borderBottom: '2px solid #d4af37', paddingBottom: '10px', color: '#1a1a1a', marginBottom: '30px' }}>
                        Catálogo Exclusivo
                    </h2>

                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '18px', marginTop: '50px' }}>Cargando joyas exclusivas...</p>
                    ) : productosFiltrados.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '16px', marginTop: '50px' }}>
                            No hay productos registrados todavía.
                        </p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
                            {productosFiltrados.map((prod) => (
                                <div key={prod.id} style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                    border: '1px solid #eaeaea',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.2s'
                                }}>
                                    <div>
                                        {prod.imagen_url ? (
                                            <img src={prod.imagen_url} alt={prod.nombre || 'Joya'} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '220px', backgroundColor: '#f0ebd8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                                Sin Imagen
                                            </div>
                                        )}
                                        <div style={{ padding: '20px' }}>
                                            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#b89728', fontWeight: 'bold' }}>
                                                {prod.categoria || 'Joya'}
                                            </span>
                                            <h3 style={{ margin: '8px 0 10px 0', fontSize: '18px', color: '#1a1a1a' }}>{prod.nombre || 'Sin nombre'}</h3>
                                            <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', margin: '0 0 15px 0' }}>{prod.descripcion}</p>
                                        </div>
                                    </div>

                                    <div style={{ padding: '0 20px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>${Number(prod.precio || 0).toFixed(2)}</span>
                                        <button
                                            onClick={() => agregarAlCarrito(prod)}
                                            style={{
                                                backgroundColor: '#1a1a1a',
                                                color: '#d4af37',
                                                border: '1px solid #d4af37',
                                                padding: '8px 16px',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '13px'
                                            }}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* SECCIÓN DEL CARRITO / CHECKOUT WHATSAPP */}
                <div style={{ flex: 1, backgroundColor: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea', height: 'fit-content', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#1a1a1a', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        Tu Carrito de Compras
                    </h3>

                    {carrito.length === 0 ? (
                        <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', margin: '30px 0' }}>Tu carrito está vacío.</p>
                    ) : (
                        <div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', maxHeight: '300px', overflowY: 'auto' }}>
                                {carrito.map((item, idx) => (
                                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f9f9f9', paddingBottom: '8px' }}>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{item.nombre || 'Producto'}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>${Number(item.precio || 0).toFixed(2)}</div>
                                        </div>
                                        <button
                                            onClick={() => quitarDelCarrito(idx)}
                                            style={{ backgroundColor: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                                <span>Total:</span>
                                <span style={{ color: '#b89728' }}>
                                    ${carrito.reduce((acc, item) => acc + Number(item.precio || 0), 0).toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={enviarPedidoWhatsApp}
                                style={{
                                    width: '100%',
                                    backgroundColor: '#25D366',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 10px rgba(37, 211, 102, 0.3)'
                                }}
                            >
                                📲 Pedir por WhatsApp
                            </button>
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}