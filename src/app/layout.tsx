import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'MD Jewelry',
    description: 'Catálogo exclusivo de joyas',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body>{children}</body>
        </html>
    )
}