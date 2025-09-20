// app.js

let sorteos = {}; // { nombreSorteo: { amigos: [], asignaciones: {} } }
let sorteoActual = null;

/**
 * Crear un nuevo sorteo
 */
function crearSorteo() {
  const nombre = prompt("Escribe un nombre para este sorteo:");
  if (!nombre) {
    alert("Debes ingresar un nombre para el sorteo.");
    return;
  }

  if (sorteos[nombre]) {
    alert("Ya existe un sorteo con ese nombre.");
    return;
  }

  sorteos[nombre] = { amigos: [], asignaciones: {} };
  sorteoActual = nombre;

  actualizarSelector();
  actualizarTituloSorteo();
  limpiarListas();
}

/**
 * Eliminar el sorteo actual
 */
function eliminarSorteo() {
  if (!sorteoActual) {
    alert("No hay un sorteo seleccionado para eliminar.");
    return;
  }

  const confirmar = confirm(`¿Seguro que deseas eliminar el sorteo "${sorteoActual}"?`);
  if (!confirmar) return;

  delete sorteos[sorteoActual];
  sorteoActual = null;

  actualizarSelector();
  document.querySelector(".section-title").textContent = "Ningún sorteo activo";
  limpiarListas();
}

/**
 * Cambiar de sorteo usando el selector
 */
function cambiarSorteo() {
  const selector = document.getElementById("selectorSorteo");
  const seleccionado = selector.value;

  if (!seleccionado) {
    sorteoActual = null;
    document.querySelector(".section-title").textContent = "Ningún sorteo activo";
    limpiarListas();
    return;
  }

  sorteoActual = seleccionado;
  actualizarTituloSorteo();
  actualizarLista();
  actualizarSelectorParticipantes();
  document.getElementById("resultado").innerHTML = "";
}

/**
 * Agregar un nuevo nombre al sorteo actual
 */
function agregarAmigo() {
  if (!sorteoActual) {
    alert("Primero debes seleccionar o crear un sorteo.");
    return;
  }

  const input = document.getElementById("amigo");
  const nombre = input.value.trim();

  if (!nombre) {
    alert("Por favor, escribe un nombre.");
    return;
  }

  if (sorteos[sorteoActual].amigos.includes(nombre)) {
    alert("El nombre ya fue agregado.");
    return;
  }

  sorteos[sorteoActual].amigos.push(nombre);
  input.value = "";
  actualizarLista();
  actualizarSelectorParticipantes();
}

/**
 * Actualizar lista de amigos en pantalla
 */
function actualizarLista() {
  const lista = document.getElementById("listaAmigos");
  lista.innerHTML = "";

  if (!sorteoActual) return;

  sorteos[sorteoActual].amigos.forEach(amigo => {
    const li = document.createElement("li");
    li.textContent = amigo;
    lista.appendChild(li);
  });
}

/**
 * Sortear amigos evitando que alguien se asigne a sí mismo
 */
function sortearAmigo() {
  if (!sorteoActual) {
    alert("Primero debes seleccionar o crear un sorteo.");
    return;
  }

  const amigos = sorteos[sorteoActual].amigos;
  if (amigos.length < 3) {
    alert("Se necesitan al menos 3 participantes para el sorteo.");
    return;
  }

  let asignados = [...amigos];
  let valido = false;
  let resultado = {};

  while (!valido) {
    asignados = mezclar([...amigos]);
    valido = true;
    resultado = {};

    for (let i = 0; i < amigos.length; i++) {
      if (amigos[i] === asignados[i]) {
        valido = false;
        break;
      }
      resultado[amigos[i]] = asignados[i];
    }
  }

  sorteos[sorteoActual].asignaciones = resultado;

  alert(`¡El sorteo "${sorteoActual}" se ha realizado con éxito!`);
  document.getElementById("resultado").innerHTML = 
    `Cada persona puede consultar su amigo secreto en el sorteo "${sorteoActual}" 👀`;
}

/**
 * Consultar amigo secreto de un participante (con selector)
 */
function verAmigoSecreto() {
  if (!sorteoActual) {
    alert("Primero debes seleccionar o crear un sorteo.");
    return;
  }

  const selector = document.getElementById("selectorParticipante");
  const nombre = selector.value;

  if (!nombre) {
    alert("Selecciona tu nombre para consultar el resultado.");
    return;
  }

  if (Object.keys(sorteos[sorteoActual].asignaciones).length === 0) {
    alert("Primero debes realizar el sorteo.");
    return;
  }

  const amigo = sorteos[sorteoActual].asignaciones[nombre];
  const resultadoDiv = document.getElementById("resultadoPersonal");

  resultadoDiv.textContent = `${nombre}, tu amigo secreto en el sorteo "${sorteoActual}" es: 🎁 ${amigo}`;
  resultadoDiv.classList.remove("oculto");

  // 🔥 Desaparece con animación
  setTimeout(() => {
    resultadoDiv.classList.add("oculto");
    setTimeout(() => { resultadoDiv.textContent = ""; }, 1000);
    }, 7000);

}



/**
 * Algoritmo de mezcla aleatoria (Fisher-Yates)
 */
function mezclar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Actualizar el título del sorteo actual
 */
function actualizarTituloSorteo() {
  const titulo = document.querySelector(".section-title");
  titulo.textContent = `Sorteo: ${sorteoActual}`;
}

/**
 * Limpiar listas visuales
 */
function limpiarListas() {
  document.getElementById("listaAmigos").innerHTML = "";
  document.getElementById("resultado").innerHTML = "";
  actualizarSelectorParticipantes();
}

/**
 * Actualizar el selector de sorteos
 */
function actualizarSelector() {
  const selector = document.getElementById("selectorSorteo");
  selector.innerHTML = `<option value="">-- Selecciona un sorteo --</option>`;

  for (const nombre in sorteos) {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    if (nombre === sorteoActual) {
      option.selected = true;
    }
    selector.appendChild(option);
  }
}

/**
 * Actualizar el selector de participantes
 */
function actualizarSelectorParticipantes() {
  const selector = document.getElementById("selectorParticipante");
  selector.innerHTML = `<option value="">-- Selecciona tu nombre --</option>`;

  if (!sorteoActual) return;

  sorteos[sorteoActual].amigos.forEach(amigo => {
    const option = document.createElement("option");
    option.value = amigo;
    option.textContent = amigo;
    selector.appendChild(option);
  });
}

