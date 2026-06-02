/*require('dotenv').config()
const express = require("express");
const routes = require("./routes/index");
const app = express();

app.use(express.json());

app.get("/", function(req, res){
    console.log("NOMBRE: ", req.query.nombre, " PAIS: ", req.query.pais);

    return res.json({mensaje: "Hola "+req.query.nombre+", saludos a: "+req.query.pais});
});

app.use("/api", routes);

app.listen(3000, function(){
    console.log("Servidor iniciado en: 3000");
});*/
require('dotenv').config();
const express = require("express");
const { recibirMensajeWebhook } = require("./controllers/whatsapp.controller"); // Ajusta la ruta

const app = express();
app.use(express.json());

// Webhook de WhatsApp
app.get("/api/Webhook", (req, res) => {
    const token = process.env.WHATSAPP_VERIFY_TOKEN || 'Mi.Token.SECRETO321';
    if (req.query['hub.verify_token'] === token) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error');
    }
});

app.post("/api/Webhook", recibirMensajeWebhook);

app.listen(3000, () => console.log("Servidor en puerto 3000"));

