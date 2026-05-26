import React from 'react'
import Calculator from './components/Calculator'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Header />
      <Calculator />
      <Footer />
    </div>
  )
}
