const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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
    let url = await fetch(`https://xzn.wtf/api/midjourney/v2?text=${prompt}&apikey=${key}`)
    let response = await url.json()

    res.render("ia_image", {
      imageUrl: response.base64,
      creator: '@ianvanh'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar la imagen');
  }
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use((req, res, next) => {
  res.status(404).render("ia_image", { imageUrl: null });
});

app.listen(port, () => {
  console.log(`La aplicación está escuchando en el puerto ${port}`);
});
