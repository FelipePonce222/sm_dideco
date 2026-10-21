import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:5000/api'

export default function AgendaModal({ funcionario, onClose }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (funcionario) {
      cargarActividades()
    }
  }, [funcionario, fechaSeleccionada])

  const cargarActividades = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `${API_BASE_URL}/actividades?funcionario_id=${funcionario.id}&fecha=${fechaSeleccionada}`
      )
      setActividades(res.data)
    } catch (err) {
      console.error('Error cargando actividades:', err)
      setActividades([])
    } finally {
      setLoading(false)
    }
  }

  if (!funcionario) return null

  const realizadas = actividades.filter((a) => a.estado === 'Realizada').length
  const enDesarrollo = actividades.filter((a) => a.estado === 'En Desarrollo').length
  const pendientes = actividades.filter((a) => a.estado === 'Pendiente').length

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          
          {/* HEADER MODAL */}
          <div className="modal-header bg-dark text-white p-4">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: '52px', height: '52px', fontSize: '1.2rem' }}
              >
                {funcionario.nombre ? funcionario.nombre.substring(0, 2).toUpperCase() : 'FC'}
              </div>
              <div>
                <h5 className="modal-title fw-bold text-white mb-0">{funcionario.nombre}</h5>
                <p className="small mb-0 text-white-50">
                  <i className="bi bi-briefcase me-1"></i>
                  {funcionario.cargo || 'Funcionario Municipal'} | {funcionario.departamento || 'DIDECO'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* BODY MODAL */}
          <div className="modal-body p-4 bg-light">
            <div className="row g-4">
              
              {/* COLUMNA IZQUIERDA: FILTRO Y RESUMEN */}
              <div className="col-lg-4 border-end-lg">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white mb-3">
                  <label className="form-label fw-bold text-secondary small text-uppercase">
                    <i className="bi bi-calendar3 me-1"></i> Seleccionar Fecha
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-lg border-2 shadow-none"
                    value={fechaSeleccionada}
                    onChange={(e) => setFechaSeleccionada(e.target.value)}
                  />
                </div>

                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                  <h6 className="fw-bold text-dark small text-uppercase mb-3">
                    <i className="bi bi-pie-chart-fill me-1 text-primary"></i> Resumen de Jornada
                  </h6>
                  
                  <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-success-subtle rounded-3">
                    <span className="small fw-semibold text-success">
                      <i className="bi bi-check-circle-fill me-1"></i> Realizadas
                    </span>
                    <span className="badge bg-success rounded-pill fs-6">{realizadas}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-2 p-2 bg-warning-subtle rounded-3">
                    <span className="small fw-semibold text-warning-emphasis">
                      <i className="bi bi-clock-history me-1"></i> En Desarrollo
                    </span>
                    <span className="badge bg-warning text-dark rounded-pill fs-6">{enDesarrollo}</span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center p-2 bg-secondary-subtle rounded-3">
                    <span className="small fw-semibold text-secondary">
                      <i className="bi bi-circle me-1"></i> Pendientes
                    </span>
                    <span className="badge bg-secondary rounded-pill fs-6">{pendientes}</span>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: ACTIVIDADES */}
              <div className="col-lg-8">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-dark mb-0">
                    <i className="bi bi-list-task me-2 text-success"></i>
                    Actividades para el {fechaSeleccionada}
                  </h6>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status"></div>
                    <p className="small text-muted mt-2">Cargando actividades...</p>
                  </div>
                ) : actividades.length === 0 ? (
                  <div className="card border-0 shadow-sm p-5 text-center bg-white rounded-3">
                    <i className="bi bi-calendar-x fs-1 text-muted mb-2"></i>
                    <h6 className="fw-bold text-muted mb-1">Sin actividades registradas</h6>
                    <small className="text-muted">No existen registros o evidencias cargadas para esta fecha.</small>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {actividades.map((act) => (
                      <div key={act.id} className="card border-0 shadow-sm rounded-3 bg-white p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <span
                              className={`badge mb-2 ${
                                act.estado === 'Realizada'
                                  ? 'bg-success'
                                  : act.estado === 'En Desarrollo'
                                  ? 'bg-warning text-dark'
                                  : 'bg-secondary'
                              }`}
                            >
                              {act.estado}
                            </span>
                            <h6 className="fw-bold text-dark mb-1">{act.titulo}</h6>
                            <p className="small text-muted mb-0">{act.descripcion || 'Sin descripción detallada.'}</p>
                          </div>
                          <span className="small text-muted bg-light px-2 py-1 rounded border">
                            <i className="bi bi-clock me-1"></i>
                            {act.hora || 'Todo el día'}
                          </span>
                        </div>

                        {act.evidencia_url && (
                          <div className="mt-2 pt-2 border-top">
                            <span className="small fw-semibold text-muted d-block mb-1">
                              <i className="bi bi-camera-fill me-1 text-primary"></i> Evidencia Fotográfica:
                            </span>
                            <a
                              href={act.evidencia_url}
                              target="_blank"
                              rel="noreferrer"
                              className="d-inline-block border rounded overflow-hidden"
                            >
                              <img
                                src={act.evidencia_url}
                                alt="Evidencia"
                                style={{ maxHeight: '120px', objectFit: 'cover' }}
                                className="img-fluid"
                              />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* FOOTER MODAL */}
          <div className="modal-footer bg-white border-top-0 px-4 py-3">
            <button type="button" className="btn btn-secondary rounded-2 px-4" onClick={onClose}>
              Cerrar
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}