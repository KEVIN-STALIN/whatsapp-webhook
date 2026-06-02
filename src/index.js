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
// ENDPOINTS PARA WHATSAPP
// =============================================

// Verificación GET (Meta Developers)
app.get("/api/Webhook", function(req, res) {
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'Mi.Token.SECRETO321';
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

// Recibir mensajes POST (WhatsApp)
app.post("/api/Webhook", async function(req, res) {
    console.log("📩 Mensaje recibido:", JSON.stringify(req.body, null, 2));
    
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];
        
        if (message && message.type === 'text') {
            const numero = message.from;
            const texto = message.text.body;
            
            console.log(`👤 ${numero} dijo: ${texto}`);
            
            // Función para responder
            await enviarMensajeWhatsApp(numero, "Recibí tu mensaje: " + texto);
        }
        
        res.sendStatus(200);
    } catch (error) {
        console.error("Error:", error);
        res.sendStatus(200);
    }
});

// Función para enviar mensajes
async function enviarMensajeWhatsApp(numero, mensaje) {
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const url = process.env.WHATSAPP_URL || 'https://graph.facebook.com/v25.0/1187712134417031/messages';
    
    const data = {
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: { body: mensaje }
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log("✅ Respuesta enviada:", result);
    } catch (error) {
        console.error("❌ Error al enviar:", error);
    }
}

// Tu código original
app.get("/", function(req, res){
    console.log("NOMBRE: ", req.query.nombre, " PAIS: ", req.query.pais);
    return res.json({mensaje: "Hola "+req.query.nombre+", saludos a: "+req.query.pais});
});

app.use("/api", routes);

app.listen(3000, function(){
    console.log("Servidor iniciado en: 3000");
});
