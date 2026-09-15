const estado = { nombres: [], listas: {} };
let personaActual = null;

const el = {
  formularioPersona: document.getElementById("formulario-persona"),
  nombreNuevo: document.getElementById("nombre-nuevo"),
  mensajePersona: document.getElementById("mensaje-persona"),
  mensajeCarga: document.getElementById("mensaje-carga"),
  cuadricula: document.getElementById("cuadricula"),
  fondo: document.getElementById("fondo"),
  cerrar: document.getElementById("cerrar"),
  nombreDetalle: document.getElementById("nombre-detalle"),
  vistaLectura: document.getElementById("vista-lectura"),
  contenidoLista: document.getElementById("contenido-lista"),
  botonEditar: document.getElementById("boton-editar"),
  vistaEdicion: document.getElementById("vista-edicion"),
  textoEdicion: document.getElementById("texto-edicion"),
  botonCancelar: document.getElementById("boton-cancelar"),
  botonGuardar: document.getElementById("boton-guardar"),
  mensajeGuardado: document.getElementById("mensaje-guardado"),
};

async function cargar() {
  try {
    const resp = await fetch("/api/listas");
    if (!resp.ok) throw new Error("respuesta no válida");
    const datos = await resp.json();
    estado.nombres = datos.nombres.filter((nombre) => typeof nombre === "string" && nombre.trim());
    estado.listas = datos.listas;
    renderCuadricula();
    el.mensajeCarga.hidden = true;
    el.cuadricula.hidden = false;
  } catch (err) {
    el.mensajeCarga.textContent =
      "No pudimos cargar la información. Intenta recargar la página.";
  }
}

function renderCuadricula() {
  el.cuadricula.innerHTML = "";
  if (estado.nombres.length === 0) {
    el.cuadricula.innerHTML = '<p class="vacio cuadricula-vacia">Todavía no hay nombres. Empieza escribiendo el tuyo arriba.</p>';
    return;
  }

  estado.nombres.forEach((nombre) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "etiqueta";
    boton.textContent = nombre;
    boton.addEventListener("click", () => abrirDetalle(nombre));
    el.cuadricula.appendChild(boton);
  });
}

function renderContenidoLista(texto) {
  const lineas = (texto || "")
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);

  if (lineas.length === 0) {
    el.contenidoLista.innerHTML = '<p class="vacio">Todavía no ha escrito su lista.</p>';
    return;
  }

  const lista = document.createElement("ul");
  lineas.forEach((linea) => {
    const item = document.createElement("li");
    item.textContent = linea;
    lista.appendChild(item);
  });
  el.contenidoLista.innerHTML = "";
  el.contenidoLista.appendChild(lista);
}

function abrirDetalle(nombre) {
  if (!nombre || !estado.nombres.includes(nombre)) return;
  personaActual = nombre;
  el.nombreDetalle.textContent = nombre;
  mostrarVistaLectura();
  el.fondo.hidden = false;
  el.cerrar.focus();
}

function cerrarDetalle() {
  el.fondo.hidden = true;
  personaActual = null;
  el.nombreDetalle.textContent = "";
}

function mostrarVistaLectura() {
  if (!personaActual || !estado.nombres.includes(personaActual)) {
    cerrarDetalle();
    return;
  }

  const texto = estado.listas[personaActual] || "";
  renderContenidoLista(texto);
  el.botonEditar.textContent = texto.trim() ? "Editar mi lista" : "Escribir mi lista";
  el.vistaLectura.hidden = false;
  el.vistaEdicion.hidden = true;
  el.mensajeGuardado.hidden = true;
}

function mostrarVistaEdicion() {
  if (!personaActual || !estado.nombres.includes(personaActual)) {
    cerrarDetalle();
    return;
  }

  el.textoEdicion.value = estado.listas[personaActual] || "";
  el.vistaLectura.hidden = true;
  el.vistaEdicion.hidden = false;
  el.mensajeGuardado.hidden = true;
  el.textoEdicion.focus();
}

async function guardarLista() {
  const nombre = personaActual;
  if (!nombre || !estado.nombres.includes(nombre)) {
    cerrarDetalle();
    alert("Primero toca tu nombre para escribir tu lista.");
    return;
  }

  const texto = el.textoEdicion.value;
  el.botonGuardar.disabled = true;
  el.botonGuardar.textContent = "Guardando…";

  try {
    const resp = await fetch(`/api/listas/${encodeURIComponent(nombre)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });
    if (!resp.ok) throw new Error("no se pudo guardar");

    estado.listas[nombre] = texto;
    el.mensajeGuardado.hidden = false;

    if (window.confetti) {
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.7 },
        colors: ["#8b2e3b", "#c99a3e", "#1e3227"],
      });
    }

    setTimeout(() => {
      if (personaActual === nombre) mostrarVistaLectura();
    }, 900);
  } catch (err) {
    alert("No se pudo guardar. Revisa tu conexión e intenta de nuevo.");
  } finally {
    el.botonGuardar.disabled = false;
    el.botonGuardar.textContent = "Guardar lista";
  }
}

async function agregarPersona(evento) {
  evento.preventDefault();
  const nombre = el.nombreNuevo.value.trim();
  if (!nombre) return;

  const boton = el.formularioPersona.querySelector("button");
  boton.disabled = true;
  el.mensajePersona.textContent = "";

  try {
    const resp = await fetch("/api/personas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    const datos = await resp.json();
    if (!resp.ok) throw new Error(datos.error || "No se pudo agregar el participante.");

    estado.nombres = datos.nombres.filter((nombreActual) => typeof nombreActual === "string" && nombreActual.trim());
    estado.listas = datos.listas;
    el.nombreNuevo.value = "";
    el.mensajePersona.textContent = "¡Listo! Ahora toca tu nombre abajo.";
    renderCuadricula();
  } catch (err) {
    el.mensajePersona.textContent = err.message;
  } finally {
    boton.disabled = false;
  }
}

el.formularioPersona.addEventListener("submit", agregarPersona);
el.botonEditar.addEventListener("click", mostrarVistaEdicion);
el.botonCancelar.addEventListener("click", mostrarVistaLectura);
el.botonGuardar.addEventListener("click", guardarLista);
el.cerrar.addEventListener("click", (evento) => {
  evento.preventDefault();
  cerrarDetalle();
});
el.fondo.addEventListener("click", (evento) => {
  if (evento.target === el.fondo) cerrarDetalle();
});
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && !el.fondo.hidden) cerrarDetalle();
});

cerrarDetalle();
cargar();
