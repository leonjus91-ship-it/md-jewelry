'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Product {
    id: number
    title: string
    price: number
    category: string
}

interface InvoiceItem {
    product: Product
    quantity: number
}

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false)
    const [password, setPassword] = useState('')

    // Datos para la Factura
    const [products, setProducts] = useState<Product[]>([])
    const [clientName, setClientName] = useState('')
    const [clientDni, setClientDni] = useState('')
    const [clientPhone, setClientPhone] = useState('')
    const [selectedProductId, setSelectedProductId] = useState<string>('')
    const [quantity, setQuantity] = useState<number>(1)
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])

    useEffect(() => {
        if (authenticated) {
            fetchProducts()
        }
    }, [authenticated])

    const fetchProducts = async () => {
        const { data } = await supabase.from('productos').select('*').order('title', { ascending: true })
        if (data) setProducts(data as Product[])
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === 'mdjewelry2026') {
            setAuthenticated(true)
        } else {
            alert('Contraseña incorrecta')
        }
    }

    const handleAddItemToInvoice = () => {
        if (!selectedProductId) return
        const prod = products.find((p) => p.id === parseInt(selectedProductId))
        if (!prod) return

        setInvoiceItems((prev) => {
            const existing = prev.find((item) => item.product.id === prod.id)
            if (existing) {
                return prev.map((item) =>
                    item.product.id === prod.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                )
            }
            return [...prev, { product: prod, quantity }]
        })

        setQuantity(1)
    }

    const handleRemoveInvoiceItem = (id: number) => {
        setInvoiceItems((prev) => prev.filter((item) => item.product.id !== id))
    }

    const total = invoiceItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

    const handlePrint = () => {
        window.print()
    }

    if (!authenticated) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fff5f7', fontFamily: "'Segoe UI', sans-serif" }}>
                <form onSubmit={handleLogin} style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', width: '320px', border: '1px solid #f7d6e0' }}>
                    <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>MD JEWELRY</h2>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>Acceso a Sistema de Facturación</p>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #f2cfd9', borderRadius: '6px', outline: 'none' }}
                    />
                    <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#d4af37', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Ingresar
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fff5f7', fontFamily: "'Segoe UI', sans-serif", padding: '30px 20px' }}>

            {/* Estilos para ocultar el panel y dejar solo la factura al imprimir */}
            <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          .print-grid {
            display: block !important;
          }
        }
      `}</style>

            <div className="no-print" style={{ maxWidth: '1000px', margin: '0 auto 25px auto', textAlign: 'center', borderBottom: '2px solid #d4af37', paddingBottom: '15px' }}>
                <h1 style={{ color: '#d4af37', margin: 0, letterSpacing: '2px' }}>SISTEMA DE FACTURACIÓN</h1>
                <p style={{ color: '#666', margin: '5px 0 0 0', fontSize: '0.9rem' }}>MD JEWELRY - Punto de Venta</p>
            </div>

            <div className="print-grid" style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>

                {/* Formulario Cliente y Productos (Oculto al Imprimir) */}
                <div className="no-print" style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '1px solid #f2cfd9', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <h3 style={{ color: '#d4af37', marginTop: 0, borderBottom: '1px solid #f2cfd9', paddingBottom: '8px' }}>Datos del Cliente</h3>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Nombre Completo:</label>
                        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ej. María López" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }} />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Cédula / RUC:</label>
                        <input type="text" value={clientDni} onChange={(e) => setClientDni(e.target.value)} placeholder="Ej. 0999999999" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }} />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#555' }}>Teléfono:</label>
                        <input type="text" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="Ej. 0987654321" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '4px' }} />
                    </div>

                    <h4 style={{ color: '#d4af37', borderBottom: '1px solid #f2cfd9', paddingBottom: '6px' }}>Agregar Joyas</h4>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                            <option value="">Seleccionar joya...</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>{p.title} - ${p.price}</option>
                            ))}
                        </select>
                        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                    </div>
                    <button onClick={handleAddItemToInvoice} style={{ width: '100%', padding: '10px', backgroundColor: '#d4af37', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                        + Agregar a Factura
                    </button>
                </div>

                {/* Vista previa de Comprobante / Factura (Única sección que se imprime) */}
                <div className="print-container" style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', border: '2px solid #d4af37', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ textAlign: 'center', borderBottom: '2px solid #d4af37', paddingBottom: '10px', marginBottom: '15px' }}>
                            <h2 style={{ margin: 0, color: '#d4af37', letterSpacing: '2px' }}>MD JEWELRY</h2>
                            <p style={{ margin: '4px 0', fontSize: '0.8rem', color: '#666' }}>COMPROBANTE DE VENTA</p>
                        </div>

                        <div style={{ fontSize: '0.85rem', marginBottom: '15px', color: '#444' }}>
                            <p style={{ margin: '3px 0' }}><strong>Cliente:</strong> {clientName || '--------------------'}</p>
                            <p style={{ margin: '3px 0' }}><strong>Cédula/RUC:</strong> {clientDni || '--------------------'}</p>
                            <p style={{ margin: '3px 0' }}><strong>Teléfono:</strong> {clientPhone || '--------------------'}</p>
                            <p style={{ margin: '3px 0' }}><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                        </div>

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '15px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #d4af37', textAlign: 'left', color: '#d4af37' }}>
                                    <th style={{ padding: '6px 0' }}>Descripción</th>
                                    <th style={{ padding: '6px 0' }}>Cant.</th>
                                    <th style={{ padding: '6px 0' }}>P.Unit</th>
                                    <th style={{ padding: '6px 0', textAlign: 'right' }}>Total</th>
                                    <th className="no-print" style={{ padding: '6px 0' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoiceItems.map((item) => (
                                    <tr key={item.product.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '6px 0' }}>{item.product.title}</td>
                                        <td style={{ padding: '6px 0' }}>{item.quantity}</td>
                                        <td style={{ padding: '6px 0' }}>${item.product.price}</td>
                                        <td style={{ padding: '6px 0', textAlign: 'right' }}>${(item.product.price * item.quantity).toFixed(2)}</td>
                                        <td className="no-print" style={{ padding: '6px 0', textAlign: 'right' }}>
                                            <button onClick={() => handleRemoveInvoiceItem(item.product.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>✕</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <div style={{ borderTop: '2px solid #d4af37', paddingTop: '10px', textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold', color: '#d4af37' }}>
                            TOTAL A PAGAR: ${total.toFixed(2)}
                        </div>
                        <button className="no-print" onClick={handlePrint} style={{ width: '100%', marginTop: '15px', padding: '12px', backgroundColor: '#25D366', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}>
                            🖨️ Imprimir / Descargar PDF
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}