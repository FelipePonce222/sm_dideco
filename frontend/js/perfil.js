document.addEventListener('DOMContentLoaded', function () {
    const usuarioGuardado = localStorage.getItem('usuario_dideco');

    // Redirigir al login si no hay sesión
    if (!usuarioGuardado) {
        window.location.href = './login.html';
        return;
    }

    const usuario = JSON.parse(usuarioGuardado);

    // Actualizar Saludo Header
    const greetingElement = document.getElementById('user-greeting-name');
    if (greetingElement && usuario.nombre) {
        greetingElement.textContent = usuario.nombre;
    }

    // Inyectar datos en la vista de perfil
    if (usuario.nombre) {
        document.getElementById('profile-nombre').textContent = usuario.nombre;
        
        // Generar avatar automático basado en el nombre
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre)}&size=150&background=0D6EFD&color=fff&font-size=0.4`;
        document.getElementById('profile-avatar').src = avatarUrl;
    }

    if (usuario.correo) {
        document.getElementById('profile-correo').innerHTML = `<i class="bi bi-envelope me-1"></i> ${usuario.correo}`;
    }

    if (usuario.rut) {
        document.getElementById('profile-rut').innerHTML = `<i class="bi bi-card-heading me-1"></i> RUT: ${usuario.rut}`;
    }
});

// Cerrar sesión
document.getElementById('btn-logout')?.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('usuario_dideco');
    window.location.href = './login.html';
});