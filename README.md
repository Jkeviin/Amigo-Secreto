# Amigo secreto 🎁

Página muy sencilla para el amigo secreto: cada quien escribe lo que le gustaría
recibir, y cualquiera puede tocar un nombre para ver esa lista (no hay usuarios
ni contraseñas, para que nadie quede "bloqueado" si abre el nombre que no era).

## Participantes y datos

Los participantes están definidos para este sorteo. Sus listas se guardan en
Cloudflare D1, por lo que no se borran al publicar una nueva versión.

## Probarla en tu computador (opcional)

Si quieres verla antes de publicarla, necesitas tener
[Node.js](https://nodejs.org) instalado. Luego, en una terminal, dentro de esta
carpeta:

```
npx wrangler dev
```

Y abre `http://localhost:3000` en el navegador.

## Publicarla en Cloudflare

Conecta este repositorio como un Worker en Cloudflare. El archivo
`wrangler.jsonc` ya enlaza la base D1 `amigo-secreto-db`.

## Cómo se usa (para compartir con el grupo)

- Al entrar, aparece una cuadrícula con los nombres de todos.
- Tocando un nombre se abre su lista de regalos.
- Si el nombre eres tú (o alguien sin lista todavía), toca el botón para
  escribir o editar la lista. Una idea por línea es lo más fácil de leer.
- Cualquiera puede abrir cualquier nombre — es a propósito, así nadie queda
  atascado si toca el nombre equivocado.
