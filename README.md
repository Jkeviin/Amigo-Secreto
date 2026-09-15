# Amigo secreto 🎁

Página muy sencilla para el amigo secreto: cada quien escribe lo que le gustaría
recibir, y cualquiera puede tocar un nombre para ver esa lista (no hay usuarios
ni contraseñas, para que nadie quede "bloqueado" si abre el nombre que no era).

## 1. Pon los nombres de tu grupo

Abre el archivo `server.js` y busca este bloque cerca del inicio:

```js
const NOMBRES = [
  "Persona 1",
  "Persona 2",
  ...
];
```

Cambia esos nombres por los de tu grupo (pueden ser más o menos de 10). Guarda
el archivo. Eso es todo lo que hay que editar.

## 2. Probarla en tu computador (opcional)

Si quieres verla antes de publicarla, necesitas tener
[Node.js](https://nodejs.org) instalado. Luego, en una terminal, dentro de esta
carpeta:

```
npm install
npm start
```

Y abre `http://localhost:3000` en el navegador.

## 3. Publicarla en Render

1. Sube esta carpeta a un repositorio de GitHub (puede ser privado).
2. Entra a [render.com](https://render.com) e inicia sesión (puedes usar tu
   cuenta de GitHub).
3. Haz clic en **New +** → **Web Service**.
4. Elige el repositorio que acabas de subir.
5. Render detecta que es Node. Deja (o confirma) estos valores:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Elige el plan gratuito (**Free**) y haz clic en **Create Web Service**.
7. Espera 1-2 minutos a que termine el despliegue. Render te da una dirección
   parecida a `https://amigo-secreto-xxxx.onrender.com`.
8. Comparte ese enlace con el grupo (por WhatsApp, por ejemplo). No necesitan
   instalar nada, solo abrir el enlace desde el navegador del celular.

### Nota sobre el plan gratuito de Render

En el plan gratuito, el servicio "se duerme" tras un rato sin uso y tarda unos
segundos en despertar la próxima vez que alguien entra — es normal, solo hay
que esperar un momento la primera vez.

También ten en cuenta que las listas se guardan en un archivo dentro del
propio servicio. Eso funciona bien mientras no vuelvas a publicar
(*redeploy*) el proyecto — si lo vuelves a publicar después de que la gente ya
escribió sus listas, ese archivo se reinicia y las listas quedan en blanco. Así
que lo ideal es: subir el proyecto una vez con los nombres correctos, y ya no
tocarlo hasta que termine el amigo secreto.

## Cómo se usa (para compartir con el grupo)

- Al entrar, aparece una cuadrícula con los nombres de todos.
- Tocando un nombre se abre su lista de regalos.
- Si el nombre eres tú (o alguien sin lista todavía), toca el botón para
  escribir o editar la lista. Una idea por línea es lo más fácil de leer.
- Cualquiera puede abrir cualquier nombre — es a propósito, así nadie queda
  atascado si toca el nombre equivocado.
