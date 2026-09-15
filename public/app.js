const estado = { nombres: [], listas: {} };
let personaActual = null;

const el = {
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
    estado.nombres = datos.nombres;
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
  personaActual = nombre;
  el.nombreDetalle.textContent = nombre;
  mostrarVistaLectura();
  el.fondo.hidden = false;
  el.cerrar.focus();
}

function cerrarDetalle() {
  el.fondo.hidden = true;
  personaActual = null;
}

function mostrarVistaLectura() {
  const texto = estado.listas[personaActual] || "";
  renderContenidoLista(texto);
  el.botonEditar.textContent = texto.trim() ? "Editar esta lista" : "Escribir mi lista";
  el.vistaLectura.hidden = false;
  el.vistaEdicion.hidden = true;
  el.mensajeGuardado.hidden = true;
}

function mostrarVistaEdicion() {
  el.textoEdicion.value = estado.listas[personaActual] || "";
  el.vistaLectura.hidden = true;
  el.vistaEdicion.hidden = false;
  el.mensajeGuardado.hidden = true;
  el.textoEdicion.focus();
}

async function guardarLista() {
  const texto = el.textoEdicion.value;
  el.botonGuardar.disabled = true;
  el.botonGuardar.textContent = "Guardando…";

  try {
    const resp = await fetch(`/api/listas/${encodeURIComponent(personaActual)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });
    if (!resp.ok) throw new Error("no se pudo guardar");

    estado.listas[personaActual] = texto;
    el.mensajeGuardado.hidden = false;

    if (window.confetti) {
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.7 },
        colors: ["#8b2e3b", "#c99a3e", "#1e3227"],
      });
    }

    setTimeout(mostrarVistaLectura, 900);
  } catch (err) {
    alert("No se pudo guardar. Revisa tu conexión e intenta de nuevo.");
  } finally {
    el.botonGuardar.disabled = false;
    el.botonGuardar.textContent = "Guardar lista";
  }
}

el.botonEditar.addEventListener("click", mostrarVistaEdicion);
el.botonCancelar.addEventListener("click", mostrarVistaLectura);
el.botonGuardar.addEventListener("click", guardarLista);
el.cerrar.addEventListener("click", cerrarDetalle);
el.fondo.addEventListener("click", (evento) => {
  if (evento.target === el.fondo) cerrarDetalle();
});
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && !el.fondo.hidden) cerrarDetalle();
});

cargar();
