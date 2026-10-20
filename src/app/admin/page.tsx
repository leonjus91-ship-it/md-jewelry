'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    // Campos del formulario
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [category, setCategory] = useState('Anillos')

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === 'mdjewelry2026') {
            setIsAuthenticated(true)
        } else {
            alert('Contraseña incorrecta')
        }
    }

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    title,
                    description,
                    price: parseFloat(price),
                    image_url: imageUrl,
                    category,
                },
            ])

        setLoading(false)

        if (error) {
            alert('Error al guardar el producto: ' + error.message)
        } else {
            alert('¡Producto agregado con éxito!')
            setTitle('')
            setDescription('')
            setPrice('')
            setImageUrl('')
        }
    }

    if (!isAuthenticated) {
        return (
            <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
                <h2>Panel de Administración - MD Jewelry</h2>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="password"
                        placeholder="Ingresa la contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ padding: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Ingresar
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Agregar Nuevo Producto</h2>
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nombre de la Joya:</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Descripción:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Precio ($):</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>URL de la Imagen:</label>
                    <input
                        type="url"
                        required
                        placeholder="https://..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Categoría:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="Anillos">Anillos</option>
                        <option value="Cadenas">Cadenas</option>
                        <option value="Pulseras">Pulseras</option>
                        <option value="Aretes">Aretes</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '12px', background: '#d4af37', color: '#000', border: 'none', fontWeight: 'bold', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {loading ? 'Guardando...' : 'Publicar Producto'}
                </button>
            </form>
        </div>
    )
}