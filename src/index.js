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
require('dotenv').config()
const express = require("express");
const routes = require("./routes/index");
const app = express();

app.use(express.json());

// =============================================
// NUEVO: Verificación para Meta Developers
// =============================================
app.get("/api/Webhook", function(req, res) {
    const verifyToken = 'Mi.Token.SECRETO321';  // Debe coincidir con Meta
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    console.log("🔐 Verificación recibida:", { mode, token });
    
    if (mode === 'subscribe' && token === verifyToken) {
        console.log("✅ Webhook verificado");
        res.status(200).send(challenge);
    } else {
        console.log("❌ Verificación falló");
        res.status(403).send('Verification failed');
    }
});

// =============================================
// NUEVO: Recibir mensajes de WhatsApp
// =============================================
app.post("/api/Webhook", function(req, res) {
    console.log("📩 Mensaje recibido:", JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
});

// Tu código original
app.get("/", function(req, res){
    console.log("NOMBRE: ", req.query.nombre, " PAIS: ", req.query.pais);
    return res.json({mensaje: "Hola "+req.query.nombre+", saludos a: "+req.query.pais});
});

app.use("/api", routes);

app.listen(3000, function(){
    console.log("Servidor iniciado en: 3000");
});
