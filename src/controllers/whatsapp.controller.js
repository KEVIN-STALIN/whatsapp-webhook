const whatsappService = require("../services/whatsapp.service");

async function enviarMensaje(req, res){
    try {
        const { numero, mensaje } = req.body;
        if(!numero || !mensaje){
            return res.status(400).json({success: false, error: "Debes enviar un número y un mensaje"});
        }

        const response = await whatsappService.enviarMensajeWhatsapp(numero, mensaje);

        return res.status(200).json({success: true, data: response});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, error: error.message});
    }
}
// =============================================
// MEMORIA DE MODO HUMANO
// Guarda los números donde el bot está pausado
// Se reinicia si el servidor se reinicia
// Para persistencia usa Redis o una base de datos
// =============================================
const modoHumano = new Set();
 
async function recibirMensajeWebhook(req, res) {
    try {
 
        console.log(JSON.stringify(req.body, null, 2));
 
        const entry = req.body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
 
        if (!value?.messages) {
            return res.status(200).send("No mensaje");
        }
 
        const message = value.messages[0];
        const numero = message.from;
        let tipoMensaje = message.type;
 
        // =============================================
        // CHEQUEO MODO HUMANO
        // Si el número está en modo humano, el bot
        // no responde NADA — el técnico habla libremente
        // Solo se sale con #bot
        // =============================================
        if (modoHumano.has(numero)) {
 
            const textoRecibido = message.text?.body?.toLowerCase().trim() || "";
 
            // SOLO se reactiva el bot si el cliente escribe exactamente "menu"
            if (textoRecibido === "menu" || textoRecibido === "menú") {
                modoHumano.delete(numero);
                console.log(`Bot reactivado para ${numero}`);
                // Continúa al bloque de texto para mostrar el menú
            } else {
                // Cualquier otro mensaje → bot sigue pausado, técnico habla libremente
                return res.status(200).json({ success: true });
            }
        }
 
        // =========================================
        // CATÁLOGO COMPLETO DE KITS DE CÁMARAS
        // =========================================
        const catalogoKits = {
            // ---- 8 MEGAPÍXELES ----
            kit_8mp_2cam: {
                nombre: "Kit 2 Cámaras 8MP",
                precio: 2680,
                descripcion: "2 cámaras de 8 megapíxeles • Alta definición 4K • Visión nocturna • Instalación incluida",
                emoji: "📷"
            },
            kit_8mp_3cam: {
                nombre: "Kit 3 Cámaras 8MP",
                precio: 3280,
                descripcion: "3 cámaras de 8 megapíxeles • Alta definición 4K • Visión nocturna • Instalación incluida",
                emoji: "📷"
            },
            kit_8mp_4cam: {
                nombre: "Kit 4 Cámaras 8MP",
                precio: 3950,
                descripcion: "4 cámaras de 8 megapíxeles • Alta definición 4K • Visión nocturna • Instalación incluida",
                emoji: "📷"
            },
            kit_8mp_5cam: {
                nombre: "Kit 5 Cámaras 8MP",
                precio: 4550,
                descripcion: "5 cámaras de 8 megapíxeles • Alta definición 4K • Visión nocturna • Instalación incluida",
                emoji: "📷"
            },
            kit_8mp_8cam: {
                nombre: "Kit 8 Cámaras 8MP",
                precio: 6350,
                descripcion: "8 cámaras de 8 megapíxeles • Alta definición 4K • Visión nocturna • Instalación incluida",
                emoji: "📷"
            },
            // ---- 5 MEGAPÍXELES ----
            kit_5mp_2cam: {
                nombre: "Kit 2 Cámaras 5MP",
                precio: 1680,
                descripcion: "2 cámaras de 5 megapíxeles • Alta definición • Visión nocturna • Instalación incluida",
                emoji: "🎥"
            },
            kit_5mp_3cam: {
                nombre: "Kit 3 Cámaras 5MP",
                precio: 2080,
                descripcion: "3 cámaras de 5 megapíxeles • Alta definición • Visión nocturna • Instalación incluida",
                emoji: "🎥"
            },
            kit_5mp_4cam: {
                nombre: "Kit 4 Cámaras 5MP",
                precio: 2550,
                descripcion: "4 cámaras de 5 megapíxeles • Alta definición • Visión nocturna • Instalación incluida",
                emoji: "🎥"
            },
            kit_5mp_5cam: {
                nombre: "Kit 5 Cámaras 5MP",
                precio: 2950,
                descripcion: "5 cámaras de 5 megapíxeles • Alta definición • Visión nocturna • Instalación incluida",
                emoji: "🎥"
            },
            kit_5mp_6cam: {
                nombre: "Kit 6 Cámaras 5MP",
                precio: 3350,
                descripcion: "6 cámaras de 5 megapíxeles • Alta definición • Visión nocturna • Instalación incluida",
                emoji: "🎥"
            },
            kit_5mp_8cam: {
                nombre: "Kit 8 Cámaras 5MP",
                precio: 4150,
                descripcion: "8 cámaras de 5 megapíxeles • Alta definición • Visión nocturna • Instalación incluida",
                emoji: "🎥"
            },
            // ---- FULL HD 2MP ----
            kit_fhd_2cam: {
                nombre: "Kit 2 Cámaras Full HD 2MP",
                precio: 1270,
                descripcion: "2 cámaras Full HD 1080p • Resolución 2MP • Visión nocturna • Instalación incluida",
                emoji: "📹"
            },
            kit_fhd_3cam: {
                nombre: "Kit 3 Cámaras Full HD 2MP",
                precio: 1565,
                descripcion: "3 cámaras Full HD 1080p • Resolución 2MP • Visión nocturna • Instalación incluida",
                emoji: "📹"
            },
            kit_fhd_4cam: {
                nombre: "Kit 4 Cámaras Full HD 2MP",
                precio: 2670,
                descripcion: "4 cámaras Full HD 1080p • Resolución 2MP • Visión nocturna • Instalación incluida",
                emoji: "📹"
            },
            kit_fhd_5cam: {
                nombre: "Kit 5 Cámaras Full HD 2MP",
                precio: 2375,
                descripcion: "5 cámaras Full HD 1080p • Resolución 2MP • Visión nocturna • Instalación incluida",
                emoji: "📹"
            },
            kit_fhd_8cam: {
                nombre: "Kit 8 Cámaras Full HD 2MP",
                precio: 3260,
                descripcion: "8 cámaras Full HD 1080p • Resolución 2MP • Visión nocturna • Instalación incluida",
                emoji: "📹"
            }
        };
 
        // =========================================
        // FUNCIÓN: Enviar resumen del kit + QR de pago
        // =========================================
        const enviarResumenKit = async (numero, kitId) => {
            const kit = catalogoKits[kitId];
            if (!kit) return;
 
            // 1. Detalles del kit + precio
            await whatsappService.enviarMensajeWhatsapp(numero, {
                type: "text",
                body:
                    `✅ *Seleccionaste:*\n` +
                    `${kit.emoji} *${kit.nombre}*\n\n` +
                    `📋 ${kit.descripcion}\n\n` +
                    `💰 *Precio Total: Bs ${kit.precio.toLocaleString()}*\n\n` +
                    `_Incluye instalación profesional, garantía y soporte técnico._`
            });
 
            // 2. Botones: el QR solo aparece si el cliente lo pide
            await whatsappService.enviarMensajeWhatsapp(numero, {
                type: "buttons",
                body: "¿Cómo deseas continuar?",
                buttons: [
                    {
                        type: "reply",
                        reply: {
                            id: "ver_qr_pago",
                            title: "💳 Pagar con QR"
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "hablar_tecnico",
                            title: "🔧 Hablar con técnico"
                        }
                    },
                    {
                        type: "reply",
                        reply: {
                            id: "ver_catalogo",
                            title: "🔙 Ver catálogo"
                        }
                    }
                ]
            });
        };
 
        // =========================================
        // MENSAJES DE TEXTO
        // =========================================
        // =========================================
        // HELPERS DE DETECCIÓN (disponibles para todos los bloques)
        // =========================================
        const tieneHora = (t) => (
            /\d{1,2}\s*(am|pm|sm)/i.test(t) ||
            /\d{1,2}:\d{2}/.test(t) ||
            /\d{1,2}\s*h(rs|oras?)?/.test(t) ||
            t.includes("las ") ||
            t.includes("mañana") || t.includes("manana") ||
            t.includes("tarde") || t.includes("noche") ||
            t.includes("sabado") || t.includes("sábado") ||
            t.includes("lunes") || t.includes("martes") ||
            t.includes("miercoles") || t.includes("miércoles") ||
            t.includes("jueves") || t.includes("viernes") ||
            /^\d{1,2}$/.test(t.trim())
        );
 
        const tieneUbicacion = (t) => (
            t.includes("maps.app.goo.gl") ||
            t.includes("maps.google") ||
            t.includes("goo.gl/maps") ||
            t.includes("google.com/maps")
        );
 
        if (tipoMensaje === "text") {
 
            let texto = message.text.body.toLowerCase().trim();
 
            console.log("Mensaje usuario:", texto);
 
            // --- SALUDO / MENÚ PRINCIPAL ---
            if (
                texto.includes("hola") ||
                texto.includes("buenas") ||
                texto.includes("buenos") ||
                texto.includes("buen dia") ||
                texto.includes("buen día") ||
                texto.includes("buenos dias") ||
                texto.includes("buenos días") ||
                texto.includes("buenas tardes") ||
                texto.includes("buenas noches") ||
                texto.includes("buenas mañanas") ||
                texto.includes("inicio") ||
                texto.includes("menu") ||
                texto.includes("menú") ||
                texto.includes("start") ||
                texto.includes("hi") ||
                texto.includes("hey") ||
                texto === "hola" ||
                texto === "ola"
            ) {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "📷 *Bienvenido a CámarasPro Bolivia*\n\n" +
                        "Somos especialistas en instalación de sistemas de videovigilancia. " +
                        "Protege tu hogar o negocio con nuestros kits profesionales.\n\n" +
                        "¿En qué podemos ayudarte?"
                });
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body: "Selecciona una opción:",
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "ver_catalogo",
                                title: "📦 Ver Catálogo"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "hablar_tecnico",
                                title: "🔧 Hablar con Técnico"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "ver_ubicacion",
                                title: "📍 Ubicación"
                            }
                        }
                    ]
                });
            }
 
            // --- ATAJO: QUIERO HABLAR CON TÉCNICO ---
            else if (
                texto.includes("tecnico") ||
                texto.includes("técnico") ||
                texto.includes("asesor") ||
                texto.includes("ayuda") ||
                texto.includes("consulta")
            ) {
 
                // Activar modo humano para este número
                modoHumano.add(numero);
                console.log(`Modo humano activado para ${numero}`);
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "🔧 *Te conectamos con un técnico ahora mismo*\n\n" +
                        "El asistente automático se ha pausado.\n\n" +
                        "👨‍🔧 Un especialista responderá tu mensaje en breve.\n\n" +
                        "⏰ *Horario de atención:*\n" +
                        "Lunes a Viernes: 8:00 - 18:00\n" +
                        "Sábados: 9:00 - 13:00\n\n" +
                        "📝 Cuéntanos tu consulta y te ayudamos 💪\n\n" +
                        "─────────────────────\n" +
                        "🤖 Cuando termines, escribe *menu* para ver el catálogo."
                });
            }
 
            // --- ATAJO: CATÁLOGO ---
            else if (
                texto.includes("catalogo") ||
                texto.includes("catálogo") ||
                texto.includes("precio") ||
                texto.includes("kit") ||
                texto.includes("camara") ||
                texto.includes("cámara")
            ) {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body:
                        "📦 *Catálogo de Kits de Cámaras*\n\n" +
                        "Tenemos tres líneas según tu presupuesto:\n\n" +
                        "📷 *8MP* - Máxima calidad 4K\n" +
                        "🎥 *5MP* - Alta definición\n" +
                        "📹 *Full HD 2MP* - Económico",
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "linea_8mp",
                                title: "📷 Kits 8 Megapíxeles"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "linea_5mp",
                                title: "🎥 Kits 5 Megapíxeles"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "linea_fhd",
                                title: "📹 Kits Full HD 2MP"
                            }
                        }
                    ]
                });
            }
 
            // --- AMBOS DATOS JUNTOS: ubicación + hora en un solo mensaje ---
            else if (tieneUbicacion(texto) && tieneHora(texto)) {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "📍🕐 *¡Perfecto, recibimos todo!* ✅\n\n" +
                        "✔️ Ubicación registrada\n" +
                        "✔️ Horario registrado\n\n" +
                        "👨‍🔧 Un técnico se comunicará contigo muy pronto para *confirmar tu cita de instalación*.\n\n" +
                        "¡Nos vemos pronto! 🎉"
                });
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body: "¿Necesitas algo más?",
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "menu_principal",
                                title: "🏠 Volver al menú"
                            }
                        }
                    ]
                });
            }
 
            // --- SOLO LINK DE UBICACIÓN ---
            else if (tieneUbicacion(texto)) {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "📍 *¡Ubicación recibida, gracias!* ✅\n\n" +
                        "Ya tenemos tu dirección registrada.\n\n" +
                        "🕐 *¿A qué hora podemos pasar a tu casa para la instalación?*\n\n" +
                        "Indícanos el horario que más te convenga\n" +
                        "_(Ej: mañana a las 10:00, tarde a las 15:00, el sábado por la mañana, etc.)_"
                });
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body: "¿Necesitas algo más?",
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "menu_principal",
                                title: "🏠 Volver al menú"
                            }
                        }
                    ]
                });
            }
 
            // --- SOLO HORA ---
            else if (tieneHora(texto)) {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "🕐 *¡Horario recibido, gracias!* ✅\n\n" +
                        "Perfecto, hemos registrado tu horario preferido.\n\n" +
                        "👨‍🔧 Un técnico se comunicará contigo muy pronto para *confirmar la fecha y hora exacta* de tu instalación.\n\n" +
                        "¡Nos vemos pronto! 🎉"
                });
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body: "¿Necesitas algo más?",
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "menu_principal",
                                title: "🏠 Volver al menú"
                            }
                        }
                    ]
                });
            }
 
            // --- DEFAULT ---
            else {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "❓ No entendí tu mensaje.\n\n" +
                        "Escribe *hola* para ver el menú principal o *catálogo* para ver nuestros kits de cámaras."
                });
            }
        }
 
 
        // =========================================
        // IMAGEN RECIBIDA = COMPROBANTE DE PAGO
        // Cuando el cliente envía una foto asumimos
        // que es su comprobante (Yape, Tigo, banco)
        // =========================================
        else if (tipoMensaje === "image") {
 
            // Comprobante recibido: pedir ubicación del cliente y hora disponible
            await whatsappService.enviarMensajeWhatsapp(numero, {
                type: "text",
                body:
                    "📸 *¡Comprobante recibido, gracias!* ✅\n\n" +
                    "Para coordinar tu instalación necesitamos dos datos:\n\n" +
                    "📍 *1. Tu ubicación* — Por favor comparte tu ubicación por WhatsApp\n" +
                    "   _(Clip 📎 → Ubicación → Enviar ubicación actual)_\n\n" +
                    "🕐 *2. ¿A qué hora podemos pasar?* — Indícanos el horario que más te conviene\n" +
                    "   _(Ej: mañana a las 10:00, tarde a las 15:00, sábado por la mañana, etc.)_\n\n" +
                    "¡En cuanto tengamos esos datos confirmamos tu cita de instalación! 🔧"
            });
        }
 
        // =========================================
        // UBICACIÓN RECIBIDA DEL CLIENTE (pin de WhatsApp)
        // =========================================
        else if (tipoMensaje === "location") {
 
            // Verificar si el pin vino con un caption que incluya hora
            const captionPin = (message.location?.name || "").toLowerCase();
            const tieneHoraEnPin = (
                /\d{1,2}\s*(am|pm|sm)/i.test(captionPin) ||
                /\d{1,2}:\d{2}/.test(captionPin) ||
                captionPin.includes("mañana") || captionPin.includes("tarde") ||
                captionPin.includes("noche") || captionPin.includes("las ")
            );
 
            if (tieneHoraEnPin) {
 
                // Llegaron los dos datos juntos
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "📍🕐 *¡Perfecto, recibimos todo!* ✅\n\n" +
                        "✔️ Ubicación registrada\n" +
                        "✔️ Horario registrado\n\n" +
                        "👨‍🔧 Un técnico se comunicará contigo muy pronto para *confirmar tu cita de instalación*.\n\n" +
                        "¡Nos vemos pronto! 🎉"
                });
 
            } else {
 
                // Solo llegó la ubicación, falta la hora
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "📍 *¡Ubicación recibida, gracias!* ✅\n\n" +
                        "Ya tenemos tu dirección registrada.\n\n" +
                        "🕐 *¿A qué hora podemos pasar a tu casa para la instalación?*\n\n" +
                        "Indícanos el horario que más te convenga\n" +
                        "_(Ej: mañana a las 10:00, tarde a las 15:00, el sábado por la mañana, etc.)_"
                });
            }
 
            await whatsappService.enviarMensajeWhatsapp(numero, {
                type: "buttons",
                body: "¿Necesitas algo más?",
                buttons: [
                    {
                        type: "reply",
                        reply: {
                            id: "menu_principal",
                            title: "🏠 Volver al menú"
                        }
                    }
                ]
            });
        }
 
        // =========================================
        // RESPUESTAS DE BOTONES (interactive)
        // =========================================
        else if (tipoMensaje === "interactive") {
 
            const buttonReply = message.interactive?.button_reply;
            const listReply = message.interactive?.list_reply;
 
            const id = buttonReply?.id || listReply?.id;
 
            console.log("Botón/Lista pulsada:", id);
 
            // =====================================
            // MENÚ PRINCIPAL
            // =====================================
 
            if (id === "ver_catalogo") {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body:
                        "📦 *Catálogo de Kits de Cámaras de Seguridad*\n\n" +
                        "Selecciona la línea que te interesa según la calidad:",
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "linea_8mp",
                                title: "📷 Kits 8 Megapíxeles"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "linea_5mp",
                                title: "🎥 Kits 5 Megapíxeles"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "linea_fhd",
                                title: "📹 Kits Full HD 2MP"
                            }
                        }
                    ]
                });
            }
 
            // =====================================
            // LÍNEA 8 MEGAPÍXELES - Selección de cantidad
            // =====================================
            else if (id === "linea_8mp") {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "📷 *Kits de 8 Megapíxeles - Calidad 4K*\n\n" +
                        "La mejor resolución del mercado. Ideal para negocios, empresas y hogares que requieren máxima claridad.\n\n" +
                        "✅ Visión nocturna en color\n" +
                        "✅ Detección de movimiento\n" +
                        "✅ Acceso remoto desde tu celular\n" +
                        "✅ Instalación profesional incluida\n\n" +
                        "*Selecciona la cantidad de cámaras:*"
                });
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body:
                        "📷 *Kits 8MP - Elige cantidad:*\n\n" +
                        "• 2 cámaras → Bs 2,680\n" +
                        "• 3 cámaras → Bs 3,280\n" +
                        "• 4 cámaras → Bs 3,950",
                    buttons: [
                        {
                            type: "reply",
                            reply: { id: "kit_8mp_2cam", title: "2 Cámaras - Bs 2,680" }
                        },
                        {
                            type: "reply",
                            reply: { id: "kit_8mp_3cam", title: "3 Cámaras - Bs 3,280" }
                        },
                        {
                            type: "reply",
                            reply: { id: "kit_8mp_4cam", title: "4 Cámaras - Bs 3,950" }
                        }
                    ]
                });
 
                // Segunda tanda (WhatsApp limita a 3 botones por mensaje)
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body: "O elige entre estos kits más grandes:",
                    buttons: [
                        {
                            type: "reply",
                            reply: { id: "kit_8mp_5cam", title: "5 Cámaras - Bs 4,550" }
                        },
                        {
                            type: "reply",
                            reply: { id: "kit_8mp_8cam", title: "8 Cámaras - Bs 6,350" }
                        },
                        {
                            type: "reply",
                            reply: { id: "ver_catalogo", title: "🔙 Volver" }
                        }
                    ]
                });
            }
 
            // =====================================
            // LÍNEA 5 MEGAPÍXELES - Selección de cantidad
            // =====================================
            else if (id === "linea_5mp") {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "🎥 *Kits de 5 Megapíxeles - Alta Definición*\n\n" +
                        "Excelente relación calidad-precio. Ideal para hogares y pequeños negocios.\n\n" +
                        "✅ Alta definición\n" +
                        "✅ Visión nocturna\n" +
                        "✅ App para celular incluida\n" +
                        "✅ Instalación profesional incluida\n\n" +
                        "*Selecciona la cantidad de cámaras:*"
                });
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body:
                        "🎥 *Kits 5MP - Elige cantidad:*\n\n" +
                        "• 2 cámaras → Bs 1,680\n" +
                        "• 3 cámaras → Bs 2,080\n" +
                        "• 4 cámaras → Bs 2,550",
                    buttons: [
                        {
                            type: "reply",
                            reply: { id: "kit_5mp_2cam", title: "2 Cámaras - Bs 1,680" }
                        },
                        {
                            type: "reply",
                            reply: { id: "kit_5mp_3cam", title: "3 Cámaras - Bs 2,080" }
                        },
                        {
                            type: "reply",
                            reply: { id: "kit_5mp_4cam", title: "4 Cámaras - Bs 2,550" }
                        }
                    ]
                });
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body:
                        "🎥 *Kits 5MP - Más opciones:*\n\n" +
                        "• 5 cámaras → Bs 2,950\n" +
                        "• 6 cámaras → Bs 3,350\n" +
                        "• 8 cámaras → Bs 4,150",
                    buttons: [
                        {
                            type: "reply",
                            reply: { id: "kit_5mp_5cam", title: "5 Cámaras - Bs 2,950" }
                        },
                        {
                            type: "reply",
                            reply: { id: "kit_5mp_6cam", title: "6 Cámaras - Bs 3,350" }
                        },
                        {
                            type: "reply",
                            reply: { id: "kit_5mp_8cam", title: "8 Cámaras - Bs 4,150" }
                        }
                    ]
                });
            }
 
            // =====================================
            // LÍNEA FULL HD 2MP - Selección de cantidad
            // =====================================
            else if (id === "linea_fhd") {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "📹 *Kits Full HD 1080p - 2 Megapíxeles*\n\n" +
                        "La opción más económica y accesible. Perfecta para vigilancia básica en casa.\n\n" +
                        "✅ Resolución Full HD 1080p\n" +
                        "✅ Visión nocturna\n" +
                        "✅ App para celular incluida\n" +
                        "✅ Instalación profesional incluida\n\n" +
                        "*Selecciona la cantidad de cámaras:*"
                });
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body:
                        "📹 *Kits Full HD - Elige cantidad:*\n\n" +
                        "• 2 cámaras → Bs 1,270\n" +
                        "• 3 cámaras → Bs 1,565\n" +
                        "• 4 cámaras → Bs 2,670",
                    buttons: [
                        {
                            type: "reply",
                            reply: { id: "kit_fhd_2cam", title: "2 Cámaras - Bs 1,270" }
                        },
                        {
                            type: "reply",
                            reply: { id: "kit_fhd_3cam", title: "3 Cámaras - Bs 1,565" }
                        },
                        {
                            type: "reply",
                            reply: { id: "kit_fhd_4cam", title: "4 Cámaras - Bs 2,670" }
                        }
                    ]
                });
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body:
                        "📹 *Kits Full HD - Más opciones:*\n\n" +
                        "• 5 cámaras → Bs 2,375\n" +
                        "• 8 cámaras → Bs 3,260",
                    buttons: [
                        {
                            type: "reply",
                            reply: { id: "kit_fhd_5cam", title: "5 Cámaras - Bs 2,375" }
                        },
                        {
                            type: "reply",
                            reply: { id: "kit_fhd_8cam", title: "8 Cámaras - Bs 3,260" }
                        },
                        {
                            type: "reply",
                            reply: { id: "ver_catalogo", title: "🔙 Volver" }
                        }
                    ]
                });
            }
 
            // =====================================
            // SELECCIÓN DE KITS 8MP
            // =====================================
            else if (id === "kit_8mp_2cam") { await enviarResumenKit(numero, "kit_8mp_2cam"); }
            else if (id === "kit_8mp_3cam") { await enviarResumenKit(numero, "kit_8mp_3cam"); }
            else if (id === "kit_8mp_4cam") { await enviarResumenKit(numero, "kit_8mp_4cam"); }
            else if (id === "kit_8mp_5cam") { await enviarResumenKit(numero, "kit_8mp_5cam"); }
            else if (id === "kit_8mp_8cam") { await enviarResumenKit(numero, "kit_8mp_8cam"); }
 
            // =====================================
            // SELECCIÓN DE KITS 5MP
            // =====================================
            else if (id === "kit_5mp_2cam") { await enviarResumenKit(numero, "kit_5mp_2cam"); }
            else if (id === "kit_5mp_3cam") { await enviarResumenKit(numero, "kit_5mp_3cam"); }
            else if (id === "kit_5mp_4cam") { await enviarResumenKit(numero, "kit_5mp_4cam"); }
            else if (id === "kit_5mp_5cam") { await enviarResumenKit(numero, "kit_5mp_5cam"); }
            else if (id === "kit_5mp_6cam") { await enviarResumenKit(numero, "kit_5mp_6cam"); }
            else if (id === "kit_5mp_8cam") { await enviarResumenKit(numero, "kit_5mp_8cam"); }
 
            // =====================================
            // SELECCIÓN DE KITS FULL HD
            // =====================================
            else if (id === "kit_fhd_2cam") { await enviarResumenKit(numero, "kit_fhd_2cam"); }
            else if (id === "kit_fhd_3cam") { await enviarResumenKit(numero, "kit_fhd_3cam"); }
            else if (id === "kit_fhd_4cam") { await enviarResumenKit(numero, "kit_fhd_4cam"); }
            else if (id === "kit_fhd_5cam") { await enviarResumenKit(numero, "kit_fhd_5cam"); }
            else if (id === "kit_fhd_8cam") { await enviarResumenKit(numero, "kit_fhd_8cam"); }
 
            // =====================================
            // VOLVER AL MENÚ PRINCIPAL
            // =====================================
            if (id === "menu_principal") {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "buttons",
                    body:
                        "📷 *CámarasPro Bolivia*\n\n" +
                        "¿En qué más te podemos ayudar?",
                    buttons: [
                        {
                            type: "reply",
                            reply: { id: "ver_catalogo", title: "📦 Ver Catálogo" }
                        },
                        {
                            type: "reply",
                            reply: { id: "hablar_tecnico", title: "🔧 Hablar con Técnico" }
                        },
                        {
                            type: "reply",
                            reply: { id: "ver_ubicacion", title: "📍 Ubicación" }
                        }
                    ]
                });
            }
 
            // =====================================
            // VER QR DE PAGO — solo cuando el cliente lo pide
            // =====================================
            else if (id === "ver_qr_pago") {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "image",
                    // 🔧 CAMBIA esta URL por la imagen de tu QR real (Tigo Money, banco, etc.)
                    link: "https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=TU-NUMERO-DE-CUENTA",
                    caption:
                        "💳 *QR de Pago*\n\n" +
                        "Escanea este código con tu app de pagos (Tigo Money, banca móvil, etc.)\n\n" +
                        "✅ Una vez realizado el pago *envíanos la foto del comprobante* por este chat.\n\n" +
                        "¡Nosotros nos encargamos del resto! 🔧"
                });
            }
 
            // =====================================
            // HABLAR CON TÉCNICO
            // Pausa el bot para este número
            // =====================================
            else if (id === "hablar_tecnico") {
 
                // Activar modo humano para este número
                modoHumano.add(numero);
                console.log(`Modo humano activado para ${numero}`);
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "🔧 *Te conectamos con un técnico ahora mismo*\n\n" +
                        "El asistente automático se ha pausado.\n\n" +
                        "👨‍🔧 Un especialista responderá tu mensaje en breve.\n\n" +
                        "⏰ *Horario de atención:*\n" +
                        "📅 Lunes a Viernes: 8:00 - 18:00\n" +
                        "📅 Sábados: 9:00 - 14:00\n\n" +
                        "📝 Cuéntanos tu consulta y te ayudamos 💪\n\n" +
                        "─────────────────────\n" +
                        "🤖 Cuando termines, escribe *menu* para ver el catálogo."
                });
            }
 
            // =====================================
            // YA PAGUÉ - Solo pide comprobante
            // =====================================
            else if (id === "confirmar_pago") {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "✅ *¡Excelente! Gracias por tu pago.*\n\n" +
                        "Para agendar tu instalación necesitamos:\n\n" +
                        "📸 *1. Foto del comprobante de pago*\n\n" +
                        "📍 *2. Tu ubicación* — comparte tu ubicación por WhatsApp\n" +
                        "   _(Clip 📎 → Ubicación → Enviar ubicación actual)_\n\n" +
                        "🕐 *3. ¿A qué hora podemos pasar a tu casa?*\n" +
                        "   _(Ej: mañana a las 10:00, tarde a las 15:00, sábado, etc.)_\n\n" +
                        "¡Con esos datos confirmamos tu cita al instante! 🔧"
                });
            }
 
            // =====================================
            // HORARIO MAÑANA seleccionado
            // =====================================
            else if (id === "horario_manana") {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "🌅 *Turno Mañana Confirmado*\n\n" +
                        "✅ Horario: *9:00 - 12:00 hrs*\n" +
                        "📅 Día: Lunes a Viernes\n\n" +
                        "📋 *Para coordinar la fecha exacta necesitamos:*\n\n" +
                        "1️⃣ Tu *dirección completa* de instalación\n" +
                        "2️⃣ Un *número de referencia* o punto de referencia\n" +
                        "3️⃣ Tu *nombre completo*\n\n" +
                        "Responde este mensaje con esos datos y un técnico te confirmará la fecha en menos de *2 horas* ⚡\n\n" +
                        "¡Gracias por confiar en *CámarasPro Bolivia*! 🎉"
                });
            }
 
            // =====================================
            // HORARIO TARDE seleccionado
            // =====================================
            else if (id === "horario_tarde") {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "🌇 *Turno Tarde Confirmado*\n\n" +
                        "✅ Horario: *14:00 - 17:00 hrs*\n" +
                        "📅 Día: Lunes a Viernes\n\n" +
                        "📋 *Para coordinar la fecha exacta necesitamos:*\n\n" +
                        "1️⃣ Tu *dirección completa* de instalación\n" +
                        "2️⃣ Un *número de referencia* o punto de referencia\n" +
                        "3️⃣ Tu *nombre completo*\n\n" +
                        "Responde este mensaje con esos datos y un técnico te confirmará la fecha en menos de *2 horas* ⚡\n\n" +
                        "¡Gracias por confiar en *CámarasPro Bolivia*! 🎉"
                });
            }
 
            // =====================================
            // HORARIO SÁBADO seleccionado
            // =====================================
            else if (id === "horario_sabado") {
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "📅 *Turno Sábado Confirmado*\n\n" +
                        "✅ Horario: *9:00 - 13:00 hrs*\n" +
                        "📅 Día: Sábado\n\n" +
                        "⚠️ _Los sábados tienen disponibilidad limitada, se agenda por orden de llegada._\n\n" +
                        "📋 *Para coordinar la fecha exacta necesitamos:*\n\n" +
                        "1️⃣ Tu *dirección completa* de instalación\n" +
                        "2️⃣ Un *número de referencia* o punto de referencia\n" +
                        "3️⃣ Tu *nombre completo*\n\n" +
                        "Responde este mensaje con esos datos y un técnico te confirmará la fecha en menos de *2 horas* ⚡\n\n" +
                        "¡Gracias por confiar en *CámarasPro Bolivia*! 🎉"
                });
            }
 
            // =====================================
            // UBICACIÓN
            // =====================================
            else if (id === "ver_ubicacion") {
 
                // ================================================
                // 📍 AQUÍ PUEDES ENVIAR EL PIN DEL MAPA
                // Cuando tengas tu ubicación, descomenta este bloque
                // y pon tus coordenadas reales (las encuentras en
                // Google Maps → clic derecho sobre tu local → copiar)
                // ------------------------------------------------
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "location",
                    latitude: "-16.495691",    // ← PON TU LATITUD AQUÍ
                    longitude: "-68.173683",   // ← PON TU LONGITUD AQUÍ
                    name: "CámarasPro Bolivia", // ← NOMBRE DE TU LOCAL
                    address: "Jose Arzabe 2894-3006, El Alto" // ← TU DIRECCIÓN
                    });
                // ================================================
 
                await whatsappService.enviarMensajeWhatsapp(numero, {
                    type: "text",
                    body:
                        "📍 *Nuestra Ubicación*\n\n" +
                        // ================================================
                        // ✏️ CAMBIA ESTA LÍNEA con tu dirección exacta
                        // Ejemplo: "📌 Calle Comercio #123, Zona Central, La Paz\n\n"
                        // ================================================
                        "📌 La Paz, Bolivia\n\n" +
                        // ================================================
                        // ✏️ CAMBIA ESTA LÍNEA con tu zona o referencia
                        // Ejemplo: "🏢 Edificio XX, Piso 2, Of. 5\n\n"

                        // ================================================
                        "🚗 Realizamos *visitas técnicas a domicilio* para evaluación sin costo.\n\n" +
                        "Escríbenos para coordinar una visita. 👷"
                });
            }
        }
 
        return res.status(200).json({
            success: true
        });
 
    } catch (error) {
 
        console.log(error);
 
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
 
module.exports = {
    enviarMensaje,
    recibirMensajeWebhook
};