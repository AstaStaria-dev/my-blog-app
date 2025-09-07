// app/layout.js
import './globals.css'

export const metadata = {
  title: 'My Blog App',
  description: 'A simple blog application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}