document.addEventListener("DOMContentLoaded", () => {
    cargarActividades();
});

// Datos simulados iniciales para igualar el mockup
const actividadesMock = [
    { funcionario: "Juan Perez", tarea: "Realizar visita adulto mayor", unidad: "DIDECO", estado: "Sin comenzar" },
    { funcionario: "Dayanna Retamal", tarea: "Realizar informe", unidad: "DIDECO", estado: "Completada" },
    { funcionario: "Patricia Valenzuela", tarea: "Gestionar casos", unidad: "DIDECO", estado: "En desarrollo" }
];

function cargarActividades() {
    const tbody = document.getElementById('tabla-actividades');
    tbody.innerHTML = '';

    actividadesMock.forEach(act => {
        const tr = document.createElement('tr');
        
        // Clase para color según estado
        let claseEstado = 'estado-sin-comenzar';
        if (act.estado === 'Completada') claseEstado = 'estado-completada';
        if (act.estado === 'En desarrollo') claseEstado = 'estado-en-desarrollo';

        tr.innerHTML = `
            <td>${act.funcionario}</td>
            <td>${act.tarea}</td>
            <td>${act.unidad}</td>
            <td><span class="badge-estado ${claseEstado}">${act.estado}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

document.getElementById('btn-logout')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('usuario_dideco');
    window.location.href = './login.html';
});

document.addEventListener('DOMContentLoaded', function () {
    // 1. Obtener la sesión guardada en el navegador
    const usuarioGuardado = localStorage.getItem('usuario_dideco');

    // 2. Si no hay usuario logueado, proteger la vista y redirigir al Login
    if (!usuarioGuardado) {
        window.location.href = './login.html';
        return;
    }

    // 3. Convertir el JSON a objeto JavaScript
    const usuario = JSON.parse(usuarioGuardado);

    // 4. Buscar el elemento HTML e inyectar el nombre
    const greetingElement = document.getElementById('user-greeting-name');
    if (greetingElement && usuario.nombre) {
        greetingElement.textContent = usuario.nombre;
    }
});

// Lógica opcional para cerrar sesión si presionas el botón de Salir
document.getElementById('btn-logout')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('usuario_dideco');
    window.location.href = './login.html';
});