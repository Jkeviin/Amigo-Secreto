const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "listas.json");

// Lee (o crea) las listas. Las claves son los nombres de los participantes.
function cargarListas() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const inicial = {};
    fs.writeFileSync(DATA_FILE, JSON.stringify(inicial, null, 2));
    return inicial;
  }

  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function guardarListas(listas) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(listas, null, 2));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Devuelve los nombres y las listas actuales.
app.get("/api/listas", (req, res) => {
  const listas = cargarListas();
  res.json({ nombres: Object.keys(listas), listas });
});

// Agrega un participante sin necesidad de editar el código.
app.post("/api/personas", (req, res) => {
  const nombre = typeof req.body.nombre === "string" ? req.body.nombre.trim() : "";
  if (!nombre || nombre.length > 80) {
    return res.status(400).json({ error: "Escribe un nombre de hasta 80 caracteres." });
  }

  const listas = cargarListas();
  const yaExiste = Object.keys(listas).some((actual) => actual.toLocaleLowerCase() === nombre.toLocaleLowerCase());
  if (yaExiste) {
    return res.status(409).json({ error: "Ese participante ya existe." });
  }

  listas[nombre] = "";
  guardarListas(listas);
  res.status(201).json({ nombre, nombres: Object.keys(listas), listas });
});

// Guarda (o actualiza) la lista de una persona.
app.post("/api/listas/:nombre", (req, res) => {
  const { nombre } = req.params;
  const texto = typeof req.body.texto === "string" ? req.body.texto : "";

  const listas = cargarListas();
  if (!(nombre in listas)) {
    return res.status(404).json({ error: "Ese nombre no existe." });
  }
  if (texto.length > 3000) {
    return res.status(400).json({ error: "La lista es demasiado larga." });
  }

  listas[nombre] = texto;
  guardarListas(listas);

  res.json({ ok: true, listas });
});

app.listen(PORT, () => {
  console.log(`Amigo secreto corriendo en http://localhost:${PORT}`);
});
