import React from 'react'

export default function Sidebar({ vistaActual, setVistaActual, user, onLogout }) {
  return (
    <div 
      className="offcanvas offcanvas-start bg-dark text-white" 
      tabIndex="-1" 
      id="menuLateral" 
      aria-labelledby="menuLateralLabel"
      style={{ width: '280px' }}
    >
      {/* HEADER DEL MENÚ */}
      <div className="offcanvas-header border-bottom border-secondary">
        <div className="d-flex align-items-center gap-2">
          <img 
            src="/Escudo-y-texto.png" 
            alt="Logo" 
            height="36" 
            className="rounded bg-white p-1"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div>
            <h6 className="fw-bold mb-0 text-white" id="menuLateralLabel">DIDECO Muni</h6>
            <small className="text-white-50" style={{ fontSize: '0.75rem' }}>Menú de Navegación</small>
          </div>
        </div>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>

      {/* CUERPO DEL MENÚ */}
      <div className="offcanvas-body d-flex flex-column justify-content-between">
        
        <ul className="nav nav-pills flex-column gap-2">
          <li className="nav-item">
            <button 
              className={`btn w-100 text-start d-flex align-items-center gap-3 rounded-3 px-3 py-2 fw-semibold ${
                vistaActual === 'dashboard' ? 'btn-success' : 'btn-dark text-white-50'
              }`}
              data-bs-dismiss="offcanvas"
              onClick={() => setVistaActual('dashboard')}
            >
              <i className="bi bi-speedometer2 fs-5"></i> Panel Principal
            </button>
          </li>

          <li className="nav-item">
            <button 
              className={`btn w-100 text-start d-flex align-items-center gap-3 rounded-3 px-3 py-2 fw-semibold ${
                vistaActual === 'funcionarios' ? 'btn-success' : 'btn-dark text-white-50'
              }`}
              data-bs-dismiss="offcanvas"
              onClick={() => setVistaActual('funcionarios')}
            >
              <i className="bi bi-people-fill fs-5"></i> Funcionarios
            </button>
          </li>

          <li className="nav-item">
            <button 
              className={`btn w-100 text-start d-flex align-items-center gap-3 rounded-3 px-3 py-2 fw-semibold ${
                vistaActual === 'agendas' ? 'btn-success' : 'btn-dark text-white-50'
              }`}
              data-bs-dismiss="offcanvas"
              onClick={() => setVistaActual('agendas')}
            >
              <i className="bi bi-calendar-week fs-5"></i> Agendas Globales
            </button>
          </li>
        </ul>

        {/* FOOTER CON PERFIL DE USUARIO */}
        <div className="pt-3 border-top border-secondary">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                {user?.nombre ? user.nombre.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="lh-sm">
                <strong className="d-block small text-white">{user?.nombre || 'Admin'}</strong>
                <small className="text-white-50" style={{ fontSize: '0.7rem' }}>{user?.rol || 'Administrador'}</small>
              </div>
            </div>
            <button 
              className="btn btn-sm btn-outline-danger border-0 p-2" 
              data-bs-dismiss="offcanvas"
              onClick={onLogout}
              title="Cerrar Sesión"
            >
              <i className="bi bi-box-arrow-right fs-5"></i>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}