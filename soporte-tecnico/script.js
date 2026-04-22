// ===== SCRIPT.JS =====
// Proyecto: Registro de Dragones
// Nota: Se usa textContent y createElement para evitar innerHTML inseguro.

// Arreglo principal de dragones registrados
const dragones = [];

// Referencias al DOM
const inputNombre = document.getElementById('nombre');
const inputCorreo = document.getElementById('correo');
const selectTipo = document.getElementById('tipo');
const inputMensaje = document.getElementById('mensaje');
const btnEnviar = document.getElementById('btnEnviar');
const btnLimpiar = document.getElementById('btnLimpiar');
const mensajeError = document.getElementById('mensajeError');
const listaDragones = document.getElementById('listaDragones');

// Expresión regular para correo
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sanitización básica para prevenir XSS simple en entradas de texto
function sanitizarTexto(texto) {
    return texto
        .trim()
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Mostrar mensajes al usuario
function mostrarMensaje(texto, esError = true) {
    mensajeError.textContent = texto;
    mensajeError.style.color = esError ? '#ff6b6b' : '#7dff7d';
}

// Limpiar mensaje
function limpiarMensaje() {
    mensajeError.textContent = '';
}

// Validaciones del formulario
function validarFormulario(nombre, correo, mensaje) {
    if (nombre === '' || correo === '' || mensaje === '') {
        mostrarMensaje('Todos los campos son obligatorios.');
        return false;
    }

    if (nombre.length < 3) {
        mostrarMensaje('El nombre del dragón debe tener al menos 3 caracteres.');
        return false;
    }

    if (!regexCorreo.test(correo)) {
        mostrarMensaje('El correo del guardián no tiene un formato válido.');
        return false;
    }

    if (mensaje.length < 10) {
        mostrarMensaje('La descripción debe tener al menos 10 caracteres.');
        return false;
    }

    return true;
}

// Crear objeto dragón
function crearDragon(nombre, correo, tipo, mensaje) {
    return {
        id: Date.now(),
        nombre: nombre,
        correo: correo,
        tipo: tipo,
        mensaje: mensaje
    };
}

// Agregar dragón al arreglo
function agregarDragon(dragon) {
    dragones.push(dragon);
}

// Eliminar dragón por id
function eliminarDragon(id) {
    const indice = dragones.findIndex(dragon => dragon.id === id);

    if (indice !== -1) {
        dragones.splice(indice, 1);
        renderizarLista();
        mostrarMensaje('Dragón eliminado correctamente.', false);
    }
}

// Renderizar lista en el DOM
function renderizarLista() {
    // Limpiar la lista actual
    listaDragones.textContent = '';

    if (dragones.length === 0) {
        const itemVacio = document.createElement('li');
        itemVacio.textContent = 'No hay dragones registrados todavía.';
        listaDragones.appendChild(itemVacio);
        return;
    }

    dragones.forEach(dragon => {
        const item = document.createElement('li');

        const nombre = document.createElement('p');
        nombre.textContent = `Nombre: ${dragon.nombre}`;

        const correo = document.createElement('p');
        correo.textContent = `Guardián: ${dragon.correo}`;

        const tipo = document.createElement('p');
        tipo.textContent = `Tipo: ${dragon.tipo}`;

        const descripcion = document.createElement('p');
        descripcion.textContent = `Descripción: ${dragon.mensaje}`;

        const btnEliminarItem = document.createElement('button');
        btnEliminarItem.textContent = 'Eliminar';
        btnEliminarItem.classList.add('btnEliminar');
        btnEliminarItem.addEventListener('click', function () {
            eliminarDragon(dragon.id);
        });

        item.appendChild(nombre);
        item.appendChild(correo);
        item.appendChild(tipo);
        item.appendChild(descripcion);
        item.appendChild(btnEliminarItem);

        listaDragones.appendChild(item);
    });
}

// Limpiar formulario
function limpiarFormulario() {
    inputNombre.value = '';
    inputCorreo.value = '';
    selectTipo.value = 'Fuego';
    inputMensaje.value = '';
    limpiarMensaje();
}

// Capturar y procesar el formulario
function procesarFormulario() {
    limpiarMensaje();

    const nombre = sanitizarTexto(inputNombre.value);
    const correo = sanitizarTexto(inputCorreo.value);
    const tipo = sanitizarTexto(selectTipo.value);
    const mensaje = sanitizarTexto(inputMensaje.value);

    const esValido = validarFormulario(nombre, correo, mensaje);

    if (!esValido) {
        return;
    }

    const nuevoDragon = crearDragon(nombre, correo, tipo, mensaje);
    agregarDragon(nuevoDragon);
    renderizarLista();
    limpiarFormulario();

    mostrarMensaje('Dragón registrado correctamente.', false);
}

// Eventos
btnEnviar.addEventListener('click', function (event) {
    event.preventDefault();
    procesarFormulario();
});

btnLimpiar.addEventListener('click', function () {
    limpiarFormulario();
    mostrarMensaje('Formulario limpiado correctamente.', false);
});

// Render inicial
renderizarLista();
