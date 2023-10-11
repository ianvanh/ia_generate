const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

const axios = require("axios");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(
  session({
    secret: "xix2j4av",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/lib/logo.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/bot.jpg'));
});

app.get("/", (req, res) => {
  res.render("ia_image", { imageUrl: null });
});
app.post('/generate', async (req, res) => {
  try {
    let prompt = req.body.prompt;
    let key = 'darkbox';
    let url = await fetch(`https://xzn.wtf/api/midjourney?text=${prompt}&apikey=${key}`)
    let response = await url.json()
    
    res.render("ia_image", {
      imageUrl: response.imageUrl,
      creator: '@ianvanh'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar la imagen');
  }
});

/*
app.get("/login", (req, res) => {
  if (req.session && req.session.username) {
    res.redirect("/bot");
  } else {
    res.render("login");
  }
});
app.get("/registro", (req, res) => {
  if (req.session && req.session.username) {
    res.redirect("/bot");
  } else {
    res.render("registro");
  }
});
app.post("/registro", (req, res) => {
    const { username, password, number } = req.body;
    const valores = req.body
    let users = getUsers();

   if (users.some((user) => user.username === username)) {
    return res.render("registro", {
      valores: valores,
      alert: true,
      icon: 'warning',
      tit: 'Error',
      msg: 'Usuario Existente!',
      conf: false,
      time: 1500,
      ruta: '',
    });
  } else if (username.length < 6) {
    return res.render('registro', {
      valores: valores,
      alert: true,
      icon: 'warning',
      tit: 'Error',
      msg: 'El nombre de usuario debe tener al menos 6 caracteres.',
      conf: false,
      time: 1500,
      ruta: '',
    });
  } else if (password.length < 6) {
    return res.render('registro', {
      valores: valores,
      alert: true,
      icon: 'warning',
      tit: 'Error',
      msg: 'La contraseña debe tener al menos 6 caracteres.',
      conf: false,
      time: 1500,
      ruta: '',
    });
  } else if (!/^\d+$/.test(number)) {
    return res.render('registro', {
      valores: valores,
      alert: true,
      icon: 'warning',
      tit: 'Error',
      msg: 'El número de telefono contiene carácteres no validos.',
      conf: false,
      time: 1500,
      ruta: '',
    });
  } else if (number.length <= 6) {
    return res.render('registro', {
      valores: valores,
      alert: true,
      icon: 'warning',
      tit: 'Error',
      msg: 'El número de telefono debe ser mayor a 6 caracteres.',
      conf: false,
      time: 1500,
      ruta: '',
    });
  } else {
    res.render("registro", {
      alert: true,
      icon: 'success',
      tit: 'Exito',
      msg: 'Usuario Guardaro!',
      conf: false,
      time: 1500,
      ruta: '/login'
    });
    users.push({ username, password, number });
    saveUsers(users);
  }
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const valores = req.body;
  const users = getUsers();

  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.render("login", {
      valores: valores,
      alert: true,
      username: username, 
      password: password,
      icon: 'warning',
      tit: 'Alerta',
      msg: 'Usuario no encontrado!',
      conf: false,
      time: 1500,
      ruta: ''
    });
  } else if (user.password !== password) {
    return res.render("login", {
      valores: valores,
      alert: true,
      username: username,
      password: password,
      icon: 'error',
      tit: 'Error',
      msg: 'Contraseña Incorrecta!',
      conf: false,
      time: 1500,
      ruta: ''
    });
  } else {
    req.session.username = username;
    res.render("login", {
      alert: true,
      icon: 'success',
      tit: 'Exito',
      msg: 'Sesion Iniciada!',
      conf: false,
      time: 1500,
      ruta: '/bot'
    });
  }
});
function requireLogin(req, res, next) {
  if (req.session && req.session.username) {
    return next();
  } else {
    res.redirect("/");
  }
}
app.get("/bot", requireLogin, (req, res) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  let username = req.session.username;
  res.render("bot", { username });
});
app.get("/contacto", requireLogin, (req, res) => {
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  let username = req.session.username;
  res.render("contact", { username });
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
*/


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});