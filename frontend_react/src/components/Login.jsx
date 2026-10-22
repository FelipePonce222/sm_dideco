import React, { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:5000/api'

export default function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { usuario, password })
      localStorage.setItem('userToken', res.data.token)
      localStorage.setItem('userData', JSON.stringify(res.data.usuario))
      onLoginSuccess(res.data.usuario)
    } catch (err) {
      setError(err.response?.data?.error || 'Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5 bg-white" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <img 
            src="/logo_muni.png" 
            alt="Logo Municipalidad" 
            height="65" 
            className="mb-3 rounded"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <h4 className="fw-bold text-dark mb-1">DIDECO Municipal</h4>
          <p className="text-muted small">Acceso al Sistema de Monitoreo Operativo</p>
        </div>

        {error && (
          <div className="alert alert-danger rounded-3 py-2 px-3 small d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small text-dark">Usuario</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-person"></i></span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                required
                placeholder="Ej: admin"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small text-dark">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-lock"></i></span>
              <input
                type="password"
                className="form-control bg-light border-start-0"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-success w-100 rounded-pill py-2 fw-bold shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <span><span className="spinner-border spinner-border-sm me-2"></span>Ingresando...</span>
            ) : (
              <span><i className="bi bi-box-arrow-in-right me-2"></i> Iniciar Sesión</span>
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            Municipalidad — Dirección de Desarrollo Comunitario
          </small>
        </div>
      </div>
    </div>
  )
}