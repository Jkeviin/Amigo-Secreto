const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// ✏️  EDITA AQUÍ: pon los nombres de las personas que participan.
// Deben ser únicos. Puedes tener más o menos de 10 sin problema.
// ─────────────────────────────────────────────────────────────
const NOMBRES = [
  "Persona 1",
  "Persona 2",
  "Persona 3",
  "Persona 4",
  "Persona 5",
  "Persona 6",
  "Persona 7",
  "Persona 8",
  "Persona 9",
  "Persona 10",
];

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "listas.json");

// Lee (o crea) el archivo donde viven las listas de cada persona.
function cargarListas() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const inicial = {};
    NOMBRES.forEach((nombre) => (inicial[nombre] = ""));
    fs.writeFileSync(DATA_FILE, JSON.stringify(inicial, null, 2));
    return inicial;
  }

  const listas = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));

  // Si se agregó un nombre nuevo en NOMBRES después de crear el archivo,
  // lo añadimos aquí para que no falte nadie.
  let cambio = false;
  NOMBRES.forEach((nombre) => {
    if (!(nombre in listas)) {
      listas[nombre] = "";
      cambio = true;
    }
  });
  if (cambio) fs.writeFileSync(DATA_FILE, JSON.stringify(listas, null, 2));

  return listas;
}

function guardarListas(listas) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(listas, null, 2));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Devuelve los nombres y las listas actuales.
app.get("/api/listas", (req, res) => {
  const listas = cargarListas();
  res.json({ nombres: NOMBRES, listas });
});

// Guarda (o actualiza) la lista de una persona.
app.post("/api/listas/:nombre", (req, res) => {
  const { nombre } = req.params;
  const texto = typeof req.body.texto === "string" ? req.body.texto : "";

  if (!NOMBRES.includes(nombre)) {
    return res.status(404).json({ error: "Ese nombre no existe." });
  }
  if (texto.length > 3000) {
    return res.status(400).json({ error: "La lista es demasiado larga." });
  }

  const listas = cargarListas();
  listas[nombre] = texto;
  guardarListas(listas);

  res.json({ ok: true, listas });
});

app.listen(PORT, () => {
  console.log(`Amigo secreto corriendo en http://localhost:${PORT}`);
});
