document.getElementById('form-login')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const alertError = document.getElementById('alert-error');
    alertError.classList.add('d-none');

    const credenciales = {
        rut: document.getElementById('rut').value.trim(),
        contrasena: document.getElementById('password').value
    };

    fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
    })
    .then(res => {
        if (!res.ok) throw new Error('Credenciales inválidas');
        return res.json();
    })
    .then(data => {
        // Guardar sesión en el navegador
        localStorage.setItem('usuario_dideco', JSON.stringify(data.usuario));
        // Redirigir al dashboard principal
        window.location.href = './index.html';
    })
    .catch(err => {
        alertError.textContent = 'RUT/Usuario o contraseña incorrectos.';
        alertError.classList.remove('d-none');
    });
});