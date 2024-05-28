const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const PORT = 3001;
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

const url =
  "/Users/nicolasdelrosario/Documents/ISIL/V/integracion-de-aplicaciones/ep1/petcare";

app.get("/", (req, res) => {
  res.sendFile(path.join(url, "index.html"));
});

app.get("/main", validateToken, (req, res) => {
  res.sendFile(path.join(url, "main.html"));
});

app.get("/appointments", (req, res) => {
  res.sendFile(path.join(url, "appointments.html"));
});

app.post("/auth", (req, res) => {
  const { username } = req.body;
  // Validating user
  const user = { username: username };
  const accessToken = generateAccessToken(user);
  res.header("authorization", accessToken).json({
    message: "Usuario autenticado",
    token: accessToken,
  });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.SECRET, { expiresIn: "10m" });
}

function validateToken(req, res, next) {
  const accessToken = req.header["authorization"] || req.query.accesstoken;
  if (!accessToken) res.send("Acceso denegado");
  jwt.verify(accessToken, process.env.SECRET, (err, user) => {
    if (err) {
      res.send("Acceso denegado, token expirado o incorrecto");
    } else {
      next();
    }
  });
}

app.listen(PORT, () => {
  console.log("Server corriendo en http://localhost:" + PORT);
});
