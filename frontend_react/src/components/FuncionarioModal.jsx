import React, { useState, useEffect } from 'react'

export default function FuncionarioModal({ funcionario, subdirecciones, departamentos, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    tipo_contrato: 'Contrata',
    subdireccion_id: '',
    departamento_id: ''
  })

  useEffect(() => {
    if (funcionario) {
      setFormData({
        nombre: funcionario.nombre || '',
        cargo: funcionario.cargo || '',
        tipo_contrato: funcionario.tipo_contrato || 'Contrata',
        subdireccion_id: funcionario.subdireccion_id || '',
        departamento_id: funcionario.departamento_id || ''
      })
    }
  }, [funcionario])

  const deptosFiltrados = formData.subdireccion_id
    ? departamentos.filter(d => d.subdireccion_id === Number(formData.subdireccion_id))
    : departamentos

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      subdireccion_id: Number(formData.subdireccion_id),
      departamento_id: Number(formData.departamento_id)
    })
  }

  return (
    <div className="modal d-block tab-index='-1'" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header bg-dark text-white rounded-top-4">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person-fill-gear me-2"></i>
              {funcionario ? 'Editar Funcionario' : 'Nuevo Funcionario'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
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
                  disabled={!formData.subdireccion_id}
                  onChange={(e) => setFormData({ ...formData, departamento_id: e.target.value })}
                >
                  <option value="">-- Seleccionar Departamento --</option>
                  {deptosFiltrados.map(dep => (
                    <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer bg-light rounded-bottom-4">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={onClose}>
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
  )
}