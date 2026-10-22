import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AgendaModal from './components/AgendaModal'
import Login from './components/Login'
import Sidebar from './components/sidebar'

const API_BASE_URL = 'http://127.0.0.1:5000/api'

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userData')
    return saved ? JSON.parse(saved) : null
  })

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
    setUser(null)
  }

  const [subdirecciones, setSubdirecciones] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [funcionarios, setFuncionarios] = useState([])
  const [vistaActual, setVistaActual] = useState('dashboard')
  
  const [selectedSub, setSelectedSub] = useState(null)
  const [selectedDepto, setSelectedDepto] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [funcionarioModal, setFuncionarioModal] = useState(null)

  // ESTADO PARA CREAR/EDITAR FUNCIONARIO
  const [modalFormOpen, setModalFormOpen] = useState(false)
  const [funcionarioEdit, setFuncionarioEdit] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    tipo_contrato: 'Contrata',
    subdireccion_id: '',
    departamento_id: ''
  })

  useEffect(() => {
    if (user) {
      cargarSubdirecciones()
      cargarDepartamentos()
      cargarFuncionarios()
    }
  }, [user])

  const cargarSubdirecciones = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/subdirecciones`)
      setSubdirecciones(res.data)
    } catch (err) {
      console.error('Error cargando subdirecciones:', err)
    }
  }

  const cargarDepartamentos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/departamentos`)
      setDepartamentos(res.data)
    } catch (err) {
      console.error('Error cargando departamentos:', err)
    }
  }

  const cargarFuncionarios = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/funcionarios`)
      setFuncionarios(res.data)
    } catch (err) {
      console.error('Error cargando funcionarios:', err)
    }
  }

  // ABRIR FORMULARIO PARA NUEVO O EDITAR
  const abrirFormulario = (func = null) => {
    if (func) {
      setFuncionarioEdit(func)
      setFormData({
        nombre: func.nombre || '',
        cargo: func.cargo || '',
        tipo_contrato: func.tipo_contrato || 'Contrata',
        subdireccion_id: func.subdireccion_id || '',
        departamento_id: func.departamento_id || ''
      })
    } else {
      setFuncionarioEdit(null)
      setFormData({
        nombre: '',
        cargo: '',
        tipo_contrato: 'Contrata',
        subdireccion_id: subdirecciones[0]?.id || '',
        departamento_id: departamentos[0]?.id || ''
      })
    }
    setModalFormOpen(true)
  }

  // GUARDAR EN LA BD
  const handleGuardarFuncionario = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        subdireccion_id: Number(formData.subdireccion_id),
        departamento_id: Number(formData.departamento_id)
      }

      if (funcionarioEdit && funcionarioEdit.id) {
        await axios.put(`${API_BASE_URL}/funcionarios/${funcionarioEdit.id}`, payload)
      } else {
        await axios.post(`${API_BASE_URL}/funcionarios`, payload)
      }

      setModalFormOpen(false)
      cargarFuncionarios()
      alert('¡Funcionario guardado con éxito! 🎉')
    } catch (err) {
      console.error('Error al guardar funcionario:', err)
      alert('Ocurrió un error al guardar. Revisa la consola o que el servidor Flask esté activo.')
    }
  }

  // ELIMINAR FUNCIONARIO
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar a este funcionario?')) {
      try {
        await axios.delete(`${API_BASE_URL}/funcionarios/${id}`)
        cargarFuncionarios()
      } catch (err) {
        console.error('Error al eliminar:', err)
      }
    }
  }

  // MOSTRAR PANTALLA DE LOGIN SI NO HAY USUARIO
  if (!user) {
    return <Login onLoginSuccess={(usuario) => setUser(usuario)} />
  }

  const deptosFiltrados = selectedSub
    ? departamentos.filter(d => d.subdireccion_id === selectedSub)
    : departamentos

  const deptosFormulario = formData.subdireccion_id
    ? departamentos.filter(d => d.subdireccion_id === Number(formData.subdireccion_id))
    : departamentos

  const funcionariosFiltrados = funcionarios.filter(f => {
    const coincideSub = selectedSub ? f.subdireccion_id === selectedSub : true
    const coincideDepto = selectedDepto ? f.departamento_id === selectedDepto : true
    const coincideBusqueda = f.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (f.cargo && f.cargo.toLowerCase().includes(searchTerm.toLowerCase()))
    return coincideSub && coincideDepto && coincideBusqueda
  })

  return (
    <div className="bg-light min-vh-100">
      
      {/* NAVBAR INSTITUCIONAL SUPERIOR CON BOTÓN DE MENÚ */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm py-2">
        <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
          
          <div className="d-flex align-items-center gap-3">
            {/* BOTÓN PARA ABRIR EL MENÚ DESPLEGABLE */}
            <button 
              className="btn btn-outline-light border-0 px-2 py-1" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#menuLateral" 
              aria-controls="menuLateral"
              title="Abrir Menú"
            >
              <i className="bi bi-list fs-2"></i>
            </button>

            <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="#">
              <img 
                src="/Escudo-y-texto.png" 
                alt="Logo Municipalidad" 
                height="40" 
                className="d-inline-block align-text-top rounded"
                onError={(e) => { e.target.style.display = 'none' }}
              />
              <span className="small text-white-90 fw-light d-none d-md-inline">| Sistema de Monitoreo Operativo</span>
            </a>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-success rounded-pill px-3 shadow-sm fw-bold border border-white"
              onClick={() => abrirFormulario()}
            >
              <i className="bi bi-person-plus-fill me-2"></i> Nuevo Funcionario
            </button>
            <span className="badge bg-secondary rounded-pill px-3 py-2 shadow-sm fs-6">
              <i className="bi bi-people-fill me-2"></i>
              {funcionariosFiltrados.length} Visibles
            </span>
          </div>

        </div>
      </nav>

      {/* COMPONENTE MENÚ SIDEBAR DESPLEGABLE */}
      <Sidebar 
        vistaActual={vistaActual} 
        setVistaActual={setVistaActual} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* CONTENIDO PRINCIPAL */}
      <div className="container-fluid px-4 py-4">

        {vistaActual === 'dashboard' || vistaActual === 'funcionarios' ? (
          <>
            {/* BANNER Y BUSCADOR */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-body p-4 bg-white rounded-4">
                <div className="row align-items-center g-3">
                  <div className="col-lg-7">
                    <span className="badge bg-success px-3 py-1 mb-2">Organigrama Interactivo DIDECO</span>
                    <h1 className="h3 fw-bold text-dark mb-1">Panel de Monitoreo Operativo</h1>
                    <p className="text-muted small mb-0">Supervisión diaria de agendas y evidencias fotográficas por funcionario.</p>
                  </div>
                  <div className="col-lg-5">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-search"></i></span>
                      <input
                        type="text"
                        className="form-control bg-light border-start-0 shadow-none"
                        placeholder="Buscar por nombre o cargo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CAPA 1: SUBDIRECCIONES */}
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold text-dark mb-0 text-uppercase d-flex align-items-center gap-2">
                  <i className="bi bi-diagram-3-fill text-primary"></i> 1. Seleccionar Subdirección
                </h6>
                {selectedSub && (
                  <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={() => { setSelectedSub(null); setSelectedDepto(null); }}>
                    <i className="bi bi-x-circle me-1"></i> Ver Todas
                  </button>
                )}
              </div>

              <div className="row g-3">
                {subdirecciones.map(sub => (
                  <div key={sub.id} className="col-12 col-sm-6 col-lg-3">
                    <div
                      className={`card border-0 shadow-sm rounded-3 p-3 h-100 transition-all ${
                        selectedSub === sub.id ? 'border border-2 border-success bg-success-subtle' : 'bg-white'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedSub(selectedSub === sub.id ? null : sub.id)
                        setSelectedDepto(null)
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-3 text-white bg-success">
                          <i className="bi bi-people-fill fs-4"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{sub.nombre}</h6>
                          <small className="text-muted">Subdirección DIDECO</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CAPA 2: DEPARTAMENTOS */}
            <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-uppercase fw-bold small text-muted">
                  <i className="bi bi-funnel-fill me-2 text-warning"></i>2. Filtrar por Departamento / Programa
                </span>
                <span className="badge bg-light text-dark border">{deptosFiltrados.length} Disponibles</span>
              </div>
              
              <div className="d-flex flex-wrap gap-2">
                <button
                  className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                    selectedDepto === null ? 'btn-warning text-dark' : 'btn-outline-secondary'
                  }`}
                  onClick={() => setSelectedDepto(null)}
                >
                  Todos los Departamentos
                </button>
                
                {deptosFiltrados.map(dep => (
                  <button
                    key={dep.id}
                    className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                      selectedDepto === dep.id ? 'btn-warning text-dark' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSelectedDepto(selectedDepto === dep.id ? null : dep.id)}
                  >
                    {dep.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* CAPA 3: FUNCIONARIOS */}
            <div className="row g-3">
              {funcionariosFiltrados.map(func => (
                <div key={func.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">      
                  <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-top border-4 border-success position-relative overflow-hidden">
                    
                    {/* BOTONES ACCION EDITAR / ELIMINAR */}
                    <div className="position-absolute top-0 end-0 p-2 d-flex gap-1 z-1">
                      <button 
                        className="btn btn-sm btn-light text-primary border-0 p-1"
                        title="Editar Funcionario"
                        onClick={() => abrirFormulario(func)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-light text-danger border-0 p-1"
                        title="Eliminar Funcionario"
                        onClick={() => handleEliminar(func.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>

                    <div className="d-flex align-items-start gap-3 mt-2">
                      <div className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '42px', height: '42px', fontSize: '0.9rem' }}>
                        {func.nombre ? func.nombre.substring(0, 2).toUpperCase() : 'FC'}
                      </div>
                      <div className="flex-grow-1 min-w-0" style={{ minWidth: 0 }}>
                        <span 
                          className="badge bg-light text-dark border small fw-normal mb-1 text-truncate d-inline-block" 
                          style={{ maxWidth: '85%' }}
                          title={func.departamento || 'Programa DIDECO'}
                        >
                          {func.departamento || 'Programa DIDECO'}
                        </span>
                        <h6 className="fw-bold text-dark mb-0 text-truncate">{func.nombre}</h6>
                        <small className="text-muted d-block mb-3 text-truncate">{func.cargo || 'Funcionario Municipal'}</small>

                        <div className="d-flex flex-wrap align-items-center justify-content-between pt-2 border-top gap-2">
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill small">
                            <i className="bi bi-check-circle-fill me-1"></i> Activo
                          </span>
                          <button 
                            className="btn btn-sm btn-outline-success rounded-2 fw-semibold px-2 py-1 small"
                            onClick={() => setFuncionarioModal(func)}
                          >
                            <i className="bi bi-calendar-week me-1"></i> Ver Agenda
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* VISTA DE AGENDAS GLOBALES */
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white my-4">
            <i className="bi bi-calendar-event text-success fs-1 mb-3"></i>
            <h4 className="fw-bold text-dark">Módulo de Agendas Globales</h4>
            <p className="text-muted col-md-6 mx-auto">
              Selecciona cualquier funcionario desde el panel principal para desplegar y auditar sus tareas, horarios y evidencias en terreno.
            </p>
            <button 
              className="btn btn-success rounded-pill px-4 align-self-center mt-2 fw-bold"
              onClick={() => setVistaActual('dashboard')}
            >
              Volver al Panel Principal
            </button>
          </div>
        )}

      </div>

      {/* MODAL PARA AGREGAR / EDITAR FUNCIONARIO */}
      {modalFormOpen && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-dark text-white rounded-top-4">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-person-fill-gear me-2"></i>
                  {funcionarioEdit ? 'Editar Funcionario' : 'Nuevo Funcionario'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalFormOpen(false)}></button>
              </div>
              
              <form onSubmit={handleGuardarFuncionario}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Ej: Juan Pérez"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Cargo / Función</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="Ej: Coordinador de Terreno"
                      value={formData.cargo}
                      onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Tipo de Contrato</label>
                    <select
                      className="form-select"
                      value={formData.tipo_contrato}
                      onChange={(e) => setFormData({ ...formData, tipo_contrato: e.target.value })}
                    >
                      <option value="Planta">Planta</option>
                      <option value="Contrata">Contrata</option>
                      <option value="Honorario">Honorario</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Subdirección</label>
                    <select
                      className="form-select"
                      required
                      value={formData.subdireccion_id}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        subdireccion_id: e.target.value,
                        departamento_id: '' 
                      })}
                    >
                      <option value="">-- Seleccionar Subdirección --</option>
                      {subdirecciones.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Departamento / Programa</label>
                    <select
                      className="form-select"
                      required
                      value={formData.departamento_id}
                      onChange={(e) => setFormData({ ...formData, departamento_id: e.target.value })}
                    >
                      <option value="">-- Seleccionar Departamento --</option>
                      {deptosFormulario.map(dep => (
                        <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer bg-light rounded-bottom-4">
                  <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setModalFormOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success rounded-pill px-4 fw-bold">
                    <i className="bi bi-floppy-fill me-2"></i> Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE AGENDA */}
      {funcionarioModal && (
        <AgendaModal 
          funcionario={funcionarioModal} 
          onClose={() => setFuncionarioModal(null)} 
        />
      )}

    </div>
  )
}