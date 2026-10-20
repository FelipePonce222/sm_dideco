document.addEventListener('DOMContentLoaded', function () {
    const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-muni shadow-sm px-4">
        <div class="container-fluid">
            <a class="navbar-brand d-flex align-items-center gap-2" href="./index.html">
                <img src="./assets/Logo_MLG.png" alt="Logo" height="40" class="bg-white p-1 rounded">
                <span class="fw-bold">Sistema Monitoreo Municipal</span>
            </a>
            <div class="d-flex align-items-center gap-3 text-white">
                <span>Hola, <strong id="user-greeting-name">Cargando...</strong></span>
                <button class="btn btn-outline-light btn-sm fw-bold px-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMenu">
                    <i class="bi bi-list me-1"></i> MENÚ
                </button>
            </div>
        </div>
    </nav>

    <!-- Menu Lateral (Offcanvas) -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasMenu">
        <div class="offcanvas-header bg-muni text-white">
            <h5 class="offcanvas-title fw-bold">Menú DIDECO</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
            <ul class="nav flex-column gap-2 fs-6">
                <li class="nav-item">
                    <a class="nav-link text-dark fw-semibold" href="./index.html">
                        <i class="bi bi-speedometer2 me-2 text-muni"></i> Dashboard Proyectos
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark fw-semibold" href="./perfil.html">
                        <i class="bi bi-person-badge me-2 text-muni"></i> Mi Perfil
                    </a>
                </li>
                <hr class="my-2">
                <li class="nav-item">
                    <a class="nav-link text-danger fw-bold" href="#" id="btn-logout">
                        <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                    </a>
                </li>
            </ul>
        </div>
    </div>
    `;

    // Buscar el contenedor en la vista e inyectar el menú
    const headerContainer = document.getElementById('navbar-container');
    if (headerContainer) {
        headerContainer.innerHTML = navbarHTML;
    }
});