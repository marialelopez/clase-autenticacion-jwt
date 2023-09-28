const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", validarToken, (req, res) => {
  res.send("<h1>El token es valido</h1>");
});
// Ruta de autorizacion como un POST
app.post("/auth", (req, res) => {
  //desestructuracion
  const { username, password } = req.body;
  if (username === "alejandra" && password === 123) {
    const user = { user: username };
    const accesToken = generarToken(user);
    res.header("autorization", accesToken).json({
      mensaje: "Usuario autenticado",
      token: accesToken,
    });
  } else {
    res.json("Usuario no autorizado");
  }
});

function generarToken(user) {
  return jwt.sign(user, "secret", { expiresIn: "2m" });
}

function validarToken(req, res, next) {
  const accesToken = req.headers["autorization"];
  if (!accesToken) {
    res.send("Acceso denegado, token invalido o expiro");
  }
  jwt.verify(accesToken, "secret", (err, user) => {
    if (err) {
      res.send("Ocurrio un error");
    } else {
      next();
    }
  });
}
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto: ${port}`);
});
