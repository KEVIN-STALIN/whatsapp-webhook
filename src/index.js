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
const routes = require("./routes/index");
const app = express();

app.use(express.json());

// =============================================
// FUNCIÓN PARA ENVIAR MENSAJES POR WHATSAPP
// =============================================
async function enviarMensajeWhatsApp(numero, mensaje) {
    const token = 'TU_TOKEN_DE_META'; // ⚠️ Pon tu token de Meta
    const phoneNumberId = '1187712134417031'; // El ID que ves en los logs
    
    const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;
    
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
        console.log("✅ Mensaje enviado:", result);
    } catch (error) {
        console.error("❌ Error al enviar:", error);
    }
}

// Verificación GET
app.get("/api/Webhook", function(req, res) {
    const verifyToken = 'Mi.Token.SECRETO321';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode === 'subscribe' && token === verifyToken) {
        res.status(200).send(challenge);
    } else {
        res.status(403).send('Verification failed');
    }
});

// Recibir mensajes POST y RESPONDER
app.post("/api/Webhook", async function(req, res) {
    console.log("📩 Mensaje recibido");
    
    try {
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];
        
        if (message && message.type === 'text') {
            const numero = message.from;
            const texto = message.text.body.toLowerCase();
            
            console.log(`👤 ${numero} dijo: ${texto}`);
            
            // Lógica de respuestas
            let respuesta = "";
            
            if (texto.includes("hola") || texto.includes("menu")) {
                respuesta = "📷 *Bienvenido a Mi Tienda*\n\n¿En qué podemos ayudarte?\n\nEscribe *CATÁLOGO* para ver productos\nEscribe *AYUDA* para más opciones";
            } 
            else if (texto.includes("catalogo")) {
                respuesta = "📦 *Catálogo:*\n\n1. Cámaras de seguridad\n2. Electrodomésticos\n3. Juguetes\n\nResponde con el número";
            }
            else if (texto.includes("ayuda")) {
                respuesta = "🆘 *Ayuda:*\n\n- Catálogo: Ver productos\n- Precios: Consultar precios\n- Técnico: Hablar con un asesor";
            }
            else {
                respuesta = "❓ No entendí tu mensaje.\n\nEscribe *HOLA* para ver el menú principal";
            }
            
            // Enviar respuesta
            await enviarMensajeWhatsApp(numero, respuesta);
        }
        
        res.sendStatus(200);
        
    } catch (error) {
        console.error("Error:", error);
        res.sendStatus(200);
    }
});

app.get("/", function(req, res){
    return res.json({mensaje: "Hola " + req.query.nombre + ", saludos a: " + req.query.pais});
});

app.use("/api", routes);

app.listen(3000, function(){
    console.log("Servidor iniciado en: 3000");
});