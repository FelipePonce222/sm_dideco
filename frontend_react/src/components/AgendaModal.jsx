import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:5000/api'

export default function AgendaModal({ funcionario, onClose }) {
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [modoFormulario, setModoFormulario] = useState(false) // true para ver el form de agregar/editar
  const [tareaEdit, setTareaEdit] = useState(null)

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '09:00',
    estado: 'Pendiente',
    evidencia_url: ''
  })

  useEffect(() => {
    if (funcionario && funcionario.id) {
      cargarActividades()
    }
  }, [funcionario])

  const cargarActividades = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/funcionarios/${funcionario.id}/actividades`)
      setActividades(res.data)
    } catch (err) {
      console.error('Error al cargar actividades:', err)
    } finally {
      setLoading(false)
    }
  }

  const abrirFormulario = (actividad = null) => {
    if (actividad) {
      setTareaEdit(actividad)
      setFormData({
        titulo: actividad.titulo || '',
        descripcion: actividad.descripcion || '',
        fecha: actividad.fecha || new Date().toISOString().split('T')[0],
        hora: actividad.hora || '09:00',
        estado: actividad.estado || 'Pendiente',
        evidencia_url: actividad.evidencia_url || ''
      })
    } else {
      setTareaEdit(null)
      setFormData({
        titulo: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0],
        hora: '09:00',
        estado: 'Pendiente',
        evidencia_url: ''
      })
    }
    setModoFormulario(true)
  }

  const handleGuardarTarea = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        funcionario_id: funcionario.id
      }

      if (tareaEdit && tareaEdit.id) {
        await axios.put(`${API_BASE_URL}/actividades/${tareaEdit.id}`, payload)
      } else {
        await axios.post(`${API_BASE_URL}/actividades`, payload)
      }

      setModoFormulario(false)
      cargarActividades()
    } catch (err) {
      console.error('Error al guardar la tarea:', err)
      alert('Error al guardar la tarea. Revisa la consola.')
    }
  }

  const handleEliminarTarea = async (id) => {
    if (window.confirm('¿Deseas eliminar esta tarea/actividad?')) {
      try {
        await axios.delete(`${API_BASE_URL}/actividades/${id}`)
        cargarActividades()
      } catch (err) {
        console.error('Error al eliminar tarea:', err)
      }
    }
  }

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg rounded-4">
          
          {/* HEADER DEL MODAL */}
          <div className="modal-header bg-dark text-white rounded-top-4 px-4 py-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                {funcionario.nombre ? funcionario.nombre.substring(0, 2).toUpperCase() : 'FC'}
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">Agenda de {funcionario.nombre}</h5>
                <small className="text-white-50">{funcionario.cargo || 'Funcionario Municipal'}</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* CUERPO DEL MODAL */}
          <div className="modal-body p-4 bg-light">
            
            {!modoFormulario ? (
              <>
                {/* VISTA: LISTA DE TAREAS */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <i className="bi bi-list-task text-primary"></i> Actividades Registradas ({actividades.length})
                  </h6>
                  <button 
                    className="btn btn-sm btn-success rounded-pill px-3 fw-bold shadow-sm"
                    onClick={() => abrirFormulario()}
                  >
                    <i className="bi bi-plus-lg me-1"></i> + Nueva Tarea
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="small text-muted mt-2">Cargando agenda...</p>
                  </div>
                ) : actividades.length === 0 ? (
                  <div className="text-center py-5 bg-white rounded-4 border border-dashed">
                    <i className="bi bi-calendar-x text-muted fs-1 mb-2 d-block"></i>
                    <p className="text-muted mb-2">No hay actividades registradas para este funcionario.</p>
                    <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => abrirFormulario()}>
                      Agregar la primera tarea
                    </button>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {actividades.map(act => (
                      <div key={act.id} className="card border-0 shadow-sm rounded-3 p-3 bg-white">
                        <div className="d-flex align-items-start justify-content-between">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className={`badge ${act.estado === 'Realizada' ? 'bg-success' : act.estado === 'En Proceso' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                {act.estado}
                              </span>
                              <small className="text-muted fw-semibold">
                                <i className="bi bi-calendar3 me-1"></i>{act.fecha} {act.hora && `| ${act.hora}`}
                              </small>
                            </div>
                            <h6 className="fw-bold text-dark mb-1">{act.titulo}</h6>
                            {act.descripcion && <p className="text-muted small mb-2">{act.descripcion}</p>}
                            
                            {act.evidencia_url && (
                              <div className="mt-2">
                                <a href={act.evidencia_url} target="_blank" rel="noreferrer" className="btn btn-xs btn-outline-info rounded-pill text-decoration-none small py-1 px-2">
                                  <i className="bi bi-image me-1"></i> Ver Evidencia / Foto
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="d-flex gap-1 ms-3">
                            <button 
                              className="btn btn-sm btn-light text-primary border-0" 
                              title="Editar Tarea"
                              onClick={() => abrirFormulario(act)}
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-light text-danger border-0" 
                              title="Eliminar Tarea"
                              onClick={() => handleEliminarTarea(act.id)}
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* VISTA: FORMULARIO CREAR / EDITAR TAREA */
              <form onSubmit={handleGuardarTarea} className="bg-white p-4 rounded-4 shadow-sm">
                <h6 className="fw-bold text-dark mb-3">
                  <i className="bi bi-pencil-square text-primary me-2"></i>
                  {tareaEdit ? 'Editar Tarea / Actividad' : 'Nueva Tarea / Actividad'}
                </h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-dark">Título de la Actividad</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="Ej: Reunión con Junta de Vecinos N°4"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-dark">Fecha</label>
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small text-dark">Hora</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.hora}
                      onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-dark">Estado</label>
                  <select
                    className="form-select"
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Realizada">Realizada</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold small text-dark">Descripción / Detalles</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Escribe acuerdos, observaciones o detalles de la actividad..."
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold small text-dark">Link Evidencia Fotográfica / Documento</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://drive.google.com/... o URL de la foto"
                    value={formData.evidencia_url}
                    onChange={(e) => setFormData({ ...formData, evidencia_url: e.target.value })}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setModoFormulario(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-bold">
                    <i className="bi bi-floppy-fill me-2"></i> Guardar Tarea
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* FOOTER DEL MODAL */}
          <div className="modal-footer bg-white rounded-bottom-4 py-2 px-4">
            <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={onClose}>
              Cerrar
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}