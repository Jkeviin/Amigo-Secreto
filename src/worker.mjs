const PARTICIPANTES = [
  "Yulieth Moreno Gallego",
  "Yessica Moreno Gallego",
  "Paula Gallego",
  "Omar Moreno",
  "Erica Gallego",
  "Juan José Avendaño Gallego",
  "Omar Sánchez",
  "Lina Gallego",
  "Hernan Felipe Barrientos Gallego",
  "Luis Miguel Barrientos Gallego",
  "Karol Martínez",
  "Jackson Morillo",
  "Tania Aponte",
  "Kevin Ortega",
];

async function prepararBase(db) {
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS listas (nombre TEXT PRIMARY KEY, texto TEXT NOT NULL DEFAULT '')"
  ).run();

  await db.batch(
    PARTICIPANTES.map((nombre) =>
      db.prepare("INSERT OR IGNORE INTO listas (nombre) VALUES (?)").bind(nombre)
    )
  );
}

async function responderListas(db) {
  await prepararBase(db);
  const { results } = await db.prepare("SELECT nombre, texto FROM listas").all();
  const textos = new Map(results.map(({ nombre, texto }) => [nombre, texto]));
  const listas = Object.fromEntries(PARTICIPANTES.map((nombre) => [nombre, textos.get(nombre) || ""]));
  return Response.json({ nombres: PARTICIPANTES, listas });
}

async function guardarLista(request, db, nombre) {
  if (!PARTICIPANTES.includes(nombre)) {
    return Response.json({ error: "Ese participante no existe." }, { status: 404 });
  }

  let datos;
  try {
    datos = await request.json();
  } catch {
    return Response.json({ error: "Datos no válidos." }, { status: 400 });
  }

  const texto = typeof datos.texto === "string" ? datos.texto : "";
  if (texto.length > 3000) {
    return Response.json({ error: "La lista es demasiado larga." }, { status: 400 });
  }

  await prepararBase(db);
  await db.prepare(
    "INSERT INTO listas (nombre, texto) VALUES (?, ?) ON CONFLICT(nombre) DO UPDATE SET texto = excluded.texto"
  ).bind(nombre, texto).run();
  return Response.json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/listas" && request.method === "GET") {
      return responderListas(env.DB);
    }

    if (url.pathname.startsWith("/api/listas/") && request.method === "POST") {
      const nombre = decodeURIComponent(url.pathname.slice("/api/listas/".length));
      return guardarLista(request, env.DB, nombre);
    }

    return env.ASSETS.fetch(request);
  },
};
