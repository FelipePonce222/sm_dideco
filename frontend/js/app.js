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